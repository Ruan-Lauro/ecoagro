using System.Globalization;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Linq;

public class Co2Service
{
    private readonly Co2DataService _co2DataService;
    private readonly ILogger<Co2Controller> _logger;
    private readonly HttpClient _httpClient;

    public Co2Service(Co2DataService co2DataService, ILogger<Co2Controller> logger)
    {
        _co2DataService = co2DataService;
        _logger = logger;
        _httpClient = new HttpClient();
    }

    public List<MunicipioDto> GetMunicipiosCidadeEstado()
    {
        return _co2DataService.Municipios.Select(m => new MunicipioDto
        {
            Cidade = m.Cidade,
            Estado = m.Estado
        }).ToList();
    }

    public async Task<float> DistanciaCidades(string origem, string destino)
    {
        try
        {
            var resOrigem = TakeCityInfor(origem) as List<Municipio>;
            var resDestino = TakeCityInfor(destino) as List<Municipio>;

            if (resOrigem == null || resDestino == null)
            {
                _logger.LogWarning("Não foi possível obter informações das cidades para {Origem} e {Destino}", origem, destino);
                return 0;
            }

            var origemData = resOrigem[0];
            var destinoData = resDestino[0];

            var origemCoord = $"{origemData.Latitude},{origemData.Longitude}";
            var destinoCoord = $"{destinoData.Latitude},{destinoData.Longitude}";

            Console.WriteLine("Coordenadas aqui:");
            Console.WriteLine(origemData);
            Console.WriteLine(destinoData);

            float distancia = await CalcularDistanciaAsync(origemCoord, destinoCoord) / 1000;

            _logger.LogInformation("Distância calculada entre {Origem} e {Destino}: {Distancia} metros",
                origem, destino, distancia);

            return distancia;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao calcular a distância entre cidades");
            return 0;
        }
    }

    public object TakeCityInfor(string origem)
    {
        var origemParts = origem.Split(" - ");

        if (origemParts.Length != 2)
        {
            _logger.LogWarning("Formato inválido para origem ou destino");
            return 0;
        }

        var cityOrigem = origemParts[0].Trim();
        var estadoOrigem = origemParts[1].Trim();

        var origemData = _co2DataService.Municipios
            .FirstOrDefault(m => m.Cidade == cityOrigem && m.Estado == estadoOrigem);

        if (origemData == null)
        {
            _logger.LogWarning("Cidade de origem ou destino não encontrada nos dados locais");
            return 0;
        }

        return new List<Municipio> { origemData };
    }

    public async Task<float> CalcularDistanciaAsync(string origins, string destinations) 
    {
        try
        {
            string apiKey = "AIzaSyAuTVBt_737piBIr4ThhDvf7Cn1EWkT0o8";
            
            origins = NormalizarCoordenadas(origins);
            destinations = NormalizarCoordenadas(destinations);
            
            string url = $"https://maps.googleapis.com/maps/api/distancematrix/xml?origins={origins}&destinations={destinations}&key={apiKey}&language=PT";

            var response = await _httpClient.GetStringAsync(url);
            var xml = XDocument.Parse(response);

            var elementStatus = xml.Descendants("element").Elements("status").FirstOrDefault()?.Value;

            if (elementStatus == "OK")
            {
                var distanciaElement = xml.Descendants("distance").Elements("value").FirstOrDefault();

                if (distanciaElement != null && float.TryParse(distanciaElement.Value, NumberStyles.Any, CultureInfo.InvariantCulture, out float distancia))
                {
                    return distancia;
                }
            }

            _logger.LogWarning($"Distância não encontrada. Element status retornado pela API: {elementStatus}");
            return 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao chamar a API do Google Distance Matrix");
            return 0;
        }
    }

    private string NormalizarCoordenadas(string coordenadas)
    {
        if (string.IsNullOrEmpty(coordenadas))
            return coordenadas;
        
        try
        {
            var regex = new System.Text.RegularExpressions.Regex(@"-?\d+[,\.]\d+");
            var matches = regex.Matches(coordenadas);
            
            if (matches.Count >= 2)
            {
                string latStr = matches[0].Value.Replace(',', '.');
                string lngStr = matches[1].Value.Replace(',', '.');
                
                if (double.TryParse(latStr, NumberStyles.Any, CultureInfo.InvariantCulture, out double latitude) &&
                    double.TryParse(lngStr, NumberStyles.Any, CultureInfo.InvariantCulture, out double longitude))
                {
                    string resultado = $"{latitude.ToString(CultureInfo.InvariantCulture)},{longitude.ToString(CultureInfo.InvariantCulture)}";
                    _logger.LogInformation("Coordenadas normalizadas: '{Original}' -> '{Normalizada}'", coordenadas, resultado);
                    return resultado;
                }
            }
            
            _logger.LogWarning("Não foi possível normalizar as coordenadas: {Coordenadas}", coordenadas);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Erro ao normalizar coordenadas: {Coordenadas}", coordenadas);
        }
        
        return coordenadas;
    }

    public float Container(string tipo, int qnt, string tm)
    {
        float container = 0;

        if (tipo == "TEU")
        {
            container = qnt;
        }
        else
        {
            container = (float)Math.Ceiling((double)qnt / 10);
        }

        container = (float)(((container + 0.5) * 2.5) / 6.32996);

        return (float)Math.Ceiling(container);
    }

    public float Consumo()
    {
        var consumo = Variavel("Consumo L/Km");

        var lcomkgco2 = Variavel("L comb -> kg CO2");

        return consumo * lcomkgco2 / 1000;
    }

    public float Variavel(string value)
    {
        var variavel = _co2DataService.Variaveis
           .FirstOrDefault(m => m.Nome == value);

        if (variavel == null || string.IsNullOrEmpty(variavel.Valor))
        {
            _logger.LogWarning("Variável " + value + " não encontrada ou valor nulo.");
            return 0f;
        }

        float consumo = float.Parse(
           variavel.Valor,
           CultureInfo.InvariantCulture
       );

        return consumo;
    }

   public string PortoOrigem(string origem)
    {
        var resOrigem = TakeCityInfor(origem) as List<Municipio>;

        if (resOrigem == null)
        {
            _logger.LogWarning("Não foi possível obter informações das cidades para {Origem}", origem);
            return "Não foi possível obter informações das cidades para Porto de Origem";
        }

        var origemData = _co2DataService.Portos
            .FirstOrDefault(m => m.Sigla == resOrigem[0].PortoProximo);

        if (origemData == null)
        {
            _logger.LogWarning("Não foi possível obter informações do porto próximo a {Origem}", origem);
            return "Não foi possível obter informações do Porto";
        }

        return origemData.Nome;
    }

    public string PortoDestino(string destino)
    {
        var resDestino = TakeCityInfor(destino) as List<Municipio>;

        if (resDestino == null)
        {
            _logger.LogWarning("Não foi possível obter informações das cidades para {Destino}", destino);
            return "Não foi possível obter informações das cidades para Porto de Destino";
        }

        var destinoData = _co2DataService.Portos
            .FirstOrDefault(m => m.Sigla == resDestino[0].PortoProximo);

        if (destinoData == null)
        {
            _logger.LogWarning("Não foi possível obter informações do porto próximo a {Destino}", destino);
            return "Não foi possível obter informações do Porto";
        }

        return destinoData.Nome;
    }

    public string TransitTime(string origem, string destino)
    {
        var resOrigem = TakeCityInfor(origem) as List<Municipio>;
        var resDestino = TakeCityInfor(destino) as List<Municipio>;

        if (resOrigem == null || resDestino == null)
        {
            _logger.LogWarning("Não foi possível obter informações das cidades para {Origem}", origem);
            return "Não foi possível obter informações das cidades para Transittime";
        }

        var origemData = _co2DataService.TransitTimes
            .FirstOrDefault(m => m.Tipo == "rota_mais_rapida" && m.Origem == resOrigem[0].PortoProximo && m.Destino == resDestino[0].PortoProximo);

        if (origemData == null)
        {
            _logger.LogWarning("Não foi possível obter informações do transitTime");
            return "Não foi possível obter informações das cidades para TransitTime";
        }

        return origemData.Servico;
    }

    public async Task<float> DistanciaPorto(string origem, string tipo)
    {
        float distancia;
        string origins;
        string destinations;

        if (TakeCityInfor(origem) is not List<Municipio> resOrigem)
        {
            _logger.LogWarning("Não foi possível obter informações das cidades para {Origem}", origem);
            return 0f;
        }

        var porto_proximo = _co2DataService.Portos
            .FirstOrDefault(m => m.Sigla == resOrigem[0].PortoProximo);

        if (porto_proximo == null)
        {
            _logger.LogWarning("Não foi possível obter informações do porto");
            return 0f;
        }

        if (tipo == "destino")
        {
            origins = porto_proximo.Latitude + "," + porto_proximo.Longitude;
            destinations = resOrigem[0].Latitude + "," + resOrigem[0].Longitude;

            distancia = await CalcularDistanciaAsync(origins, destinations);
            return distancia / 1000;
        }
        else
        {
            destinations = porto_proximo.Latitude + "," + porto_proximo.Longitude;
            origins = resOrigem[0].Latitude + "," + resOrigem[0].Longitude;

            distancia = await CalcularDistanciaAsync(origins, destinations);
            return distancia / 1000;
        }

    }

    // Substituindo a duplicidade de ConsumoPorto
    public float PortoIndireto(string origem, string destino)
    {
        var capacidade = Variavel("Capacidade (TEUs)");

        if (TakeCityInfor(origem) is not List<Municipio> resOrigem || TakeCityInfor(destino) is not List<Municipio> resDestino)
        {
            _logger.LogWarning("Não foi possível obter informações das cidades para {Origem}", origem);
            return 0f;
        }

        var portos = _co2DataService.Rotas
            .FirstOrDefault(m => m.Origem == resOrigem[0].PortoProximo && m.Destino == resDestino[0].PortoProximo);

        if (portos == null)
        {
            _logger.LogWarning("Não foi possível obter informações do Porto");
            return 0f;
        }

        var portosRota = portos.DescricaoRota.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .ToList();

        var consumo = TrazConsumoPorPorto(portosRota, capacidade);
        Console.WriteLine("Resultado: ");
        Console.WriteLine(consumo);
        Console.WriteLine(capacidade);
        return consumo.Sum();
    }

    public List<float> TrazConsumoPorPorto(List<string> portos, float capacidade)
    {
        List<float> consumo = [];

        foreach (var p in portos)
        {
            foreach (var porto in _co2DataService.ConsumoPorPortos)
            {
                if (porto.code == p && float.TryParse(porto.average_stay_h.ToString(), NumberStyles.Float, CultureInfo.InvariantCulture, out float averageStay))
                {
                    var consumption = 0.5f * averageStay + 1;
                    consumo.Add(consumption / capacidade);
                }
            }
        }

        return consumo;
    }

    public float InteiroOrDecimo(string tipo, float qnt)
    {
        var container = tipo == "TEU" ? qnt : qnt / 10;

        return (float)Math.Ceiling(container);
    }

    public float DryReefer(string formato)
    {
        if (formato == "dry")
        {
            return Variavel("Conversão Combustível -> CO2 -> Dry");
        }
        else
        {
            return Variavel("Conversão Combustível -> CO2 -> Reefer");
        }
    }

    public float ConsumoTransporte(string origem, string destino)
    {
        var resOrigem = TakeCityInfor(origem) as List<Municipio>;
        var resDestino = TakeCityInfor(destino) as List<Municipio>;

        if (resOrigem == null || resDestino == null)
        {
            _logger.LogWarning("Não foi possível obter informações das cidades para {Origem}", origem);
            return 0f;
        }

        double velocidade_nos = Math.Round(Convert.ToDouble(Variavel("Velocidade (nós)")),1);
        double capacidade_teus = Math.Round(Convert.ToDouble(Variavel("Capacidade (TEUs)")), 1);
        
        var consumo_por_nos = _co2DataService.Navios
            .FirstOrDefault(m => m.Nos == velocidade_nos);

        var velocidade_km_dia = velocidade_nos * 44.448;
        var consumo_por_teus = consumo_por_nos!.Consumo / (capacidade_teus*velocidade_km_dia);
        var consumo_por_porto = _co2DataService.OrigemDestinos
            .FirstOrDefault(m => m.Origem == resOrigem[0].PortoProximo && m.Destino == resDestino[0].PortoProximo && m.Tipo == "porto_intermediario");


        return (float)(consumo_por_teus * Convert.ToInt32(consumo_por_porto!.Km));
    }
   
}
