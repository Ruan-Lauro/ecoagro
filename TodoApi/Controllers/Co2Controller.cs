using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class Co2Controller : ControllerBase
{

    private readonly Co2Service _co2Service;
    private readonly ILogger<Co2Controller> _logger;

    public Co2Controller(Co2Service co2Service, ILogger<Co2Controller> logger)
    {
        _co2Service = co2Service;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetCo2Records()
    {
        var dados = _co2Service.GetMunicipiosCidadeEstado();

        if (dados == null)
        {
            return NotFound("Dados ou municipios não encontrados.");
        }

        return Ok(dados);
    }


    [HttpPost]
    public async Task<IActionResult> CreateAnalysis([FromBody] AnalysisRequest request)
    {
        try
        {
            var listCidade = _co2Service.GetMunicipiosCidadeEstado();
            var cidadeOrigem = request.origem.Split('-').Select(s => s.Trim()).ToList();
            var cidadeDestino = request.destino.Split('-').Select(s => s.Trim()).ToList();

            if (listCidade.Find(x => x.Cidade == cidadeOrigem[0] && x.Estado == cidadeOrigem[1]) == null)
            {
                return BadRequest(new { error = "Cidade de origem inválida." });

            } else if (listCidade.Find(x => x.Cidade == cidadeDestino[0] && x.Estado == cidadeDestino[1]) == null) {
                return BadRequest(new { error = "Cidade de destino inválida." });
            }

            var distancia = await _co2Service.DistanciaCidades(request.origem, request.destino);

            var container = _co2Service.Container(request.carregamento, request.quantidadeTEUs, request.formatoDeContainers);

            var consumo = _co2Service.Consumo();

            var dados = new Dictionary<string, object>
            {
                ["quantidade"] = request.quantidadeTEUs,
                ["formato"] = request.formatoDeContainers,
                ["carregamento"] = request.carregamento,
                ["origem"] = request.origem,
                ["destino"] = request.destino,
                ["porto_origem"] = _co2Service.PortoOrigem(request.origem),
                ["porto_destino"] = _co2Service.PortoDestino(request.destino),
                ["transit_time"] = _co2Service.TransitTime(request.origem, request.destino)
            };

            dados["rel_rodoviario"] = distancia * consumo * container;

            dados["rel_porta_porto"] = await _co2Service.DistanciaPorto(request.origem, "origem") * consumo * container;

            Console.WriteLine(await _co2Service.DistanciaPorto(request.origem, "origem"));
            Console.WriteLine(consumo);
            Console.WriteLine(container);

            dados["rel_ativ_porto"] = _co2Service.PortoIndireto(request.origem, request.destino) *
                                    _co2Service.InteiroOrDecimo(request.carregamento, request.quantidadeTEUs) *
                                    _co2Service.DryReefer(request.formatoDeContainers);

            dados["rel_cabotagem"] = _co2Service.ConsumoTransporte(request.origem, request.destino) *
                                    _co2Service.InteiroOrDecimo(request.carregamento, request.quantidadeTEUs) *
                                    _co2Service.DryReefer(request.formatoDeContainers);

            dados["rel_porto_porta"] = await _co2Service.DistanciaPorto(request.destino, "destino") * consumo * container;

            dados["total_rodoviario"] = dados["rel_rodoviario"];

            dados["total_mercosul"] = Convert.ToSingle(dados["rel_porta_porto"])
                        + Convert.ToSingle(dados["rel_ativ_porto"])
                        + Convert.ToSingle(dados["rel_cabotagem"])
                        + Convert.ToSingle(dados["rel_porto_porta"]);

            var totalRodoviario = (float)dados["total_rodoviario"];
            var totalMercosul = (float)dados["total_mercosul"];

            dados["economia"] = Math.Round(Math.Round(totalRodoviario, 2) - Math.Round(totalMercosul, 2), 2);
            dados["arvores"] = Math.Round(((totalRodoviario - totalMercosul) / 0.060493f), 0);
            dados["gelo"] = Math.Round(((totalRodoviario - totalMercosul) * 3), 1);
            
            dados["caminhoes"] = Math.Ceiling(2.5 * (Math.Ceiling((double)request.quantidadeTEUs) + 0.5) / 6.32996);
            dados["credito_carbono"] = Math.Floor(Convert.ToSingle(dados["economia"]));

            return Ok(dados);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar análise de CO2");
            return BadRequest(new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

}
