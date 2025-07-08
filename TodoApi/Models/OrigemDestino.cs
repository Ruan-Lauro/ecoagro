using System.Text.Json.Serialization;

public class OrigemDestino
{
    [JsonPropertyName("origem")]
    public string Origem { get; set; }

    [JsonPropertyName("destino")]
    public string Destino { get; set; }

    [JsonPropertyName("tipo")]
    public string Tipo { get; set; }

    [JsonPropertyName("km")]
    public double Km { get; set; }
}
