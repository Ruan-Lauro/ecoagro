using System.Text.Json.Serialization;

public class Municipio
{
    [JsonPropertyName("cidade")]
    public string Cidade { get; set; }

    [JsonPropertyName("estado")]
    public string Estado { get; set; }

    [JsonPropertyName("porto_proximo")]
    public string PortoProximo { get; set; }

    [JsonPropertyName("lat")]
    public string Latitude { get; set; }

    [JsonPropertyName("long")]
    public string Longitude { get; set; }
}
