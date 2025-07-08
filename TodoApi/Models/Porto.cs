using System.Text.Json.Serialization;

public class Porto
{
    [JsonPropertyName("sigla")]
    public string Sigla { get; set; }

    [JsonPropertyName("nome")]
    public string Nome { get; set; }

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }
}
