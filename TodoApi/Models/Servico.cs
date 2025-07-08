using System.Text.Json.Serialization;

public class Servico
{
    [JsonPropertyName("nome")]
    public string Nome { get; set; }

    [JsonPropertyName("porto")]
    public string Porto { get; set; }

    [JsonPropertyName("ordem")]
    public int Ordem { get; set; }

    [JsonPropertyName("consumo")]
    public double Consumo { get; set; }
}
