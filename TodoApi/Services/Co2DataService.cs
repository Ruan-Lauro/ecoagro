using System.Text.Json;

public class Co2DataService
{
    public List<Municipio> Municipios { get; }
    public List<Navio> Navios { get; }
    public List<OrigemDestino> OrigemDestinos { get; }
    public List<Porto> Portos { get; }
    public List<Rota> Rotas { get; }
    public List<Servico> Servicos { get; }
    public List<TransitTime> TransitTimes { get; }
    public List<Variavel> Variaveis { get; }

    public List<ConsumoPorPorto> ConsumoPorPortos { get; }

    public Co2DataService(IWebHostEnvironment env)
    {
        var jsonPath = Path.Combine(env.ContentRootPath, "calculadora_co2.json");
        var jsonData = File.ReadAllText(jsonPath);

        var dados = JsonSerializer.Deserialize<CalculadoraCo2>(jsonData);

        ConsumoPorPortos = dados?.ConsumoPorPorto ?? new List<ConsumoPorPorto>();
        Municipios = dados?.Municipios ?? new List<Municipio>();
        Navios = dados?.Navios ?? new List<Navio>();
        OrigemDestinos = dados?.OrigemDestinos ?? new List<OrigemDestino>();
        Portos = dados?.Portos ?? new List<Porto>();
        Rotas = dados?.Rotas ?? new List<Rota>();
        Servicos = dados?.Servicos ?? new List<Servico>();
        TransitTimes = dados?.TransitTimes ?? new List<TransitTime>();
        Variaveis = dados?.Variaveis ?? new List<Variavel>();
    }
}
