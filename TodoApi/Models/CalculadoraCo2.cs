using System.Text.Json.Serialization;

public class CalculadoraCo2
{
    [JsonPropertyName("consumo_por_portos")]
    public List<ConsumoPorPorto> ConsumoPorPorto { get; set; }

    [JsonPropertyName("municipios")]
    public List<Municipio> Municipios { get; set; }

    [JsonPropertyName("navios")]
    public List<Navio> Navios { get; set; }

    [JsonPropertyName("origem_destinos")]
    public List<OrigemDestino> OrigemDestinos { get; set; }

    [JsonPropertyName("portos")]
    public List<Porto> Portos { get; set; }

    [JsonPropertyName("rotas")]
    public List<Rota> Rotas { get; set; }

    [JsonPropertyName("servicos")]
    public List<Servico> Servicos { get; set; }

    [JsonPropertyName("transit_times")]
    public List<TransitTime> TransitTimes { get; set; }

    [JsonPropertyName("variaveis")]
    public List<Variavel> Variaveis { get; set; }
}
