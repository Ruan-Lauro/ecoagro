using System.Text.Json.Serialization;

public class Navio
{
    [JsonPropertyName("nos")]
    public double Nos { get; set; }

    [JsonPropertyName("consumo")]
    public double Consumo { get; set; }

    [JsonPropertyName("rpm")]
    public double Rpm { get; set; }
}
