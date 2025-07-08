using System.Text.Json.Serialization;

public class TransitTime
{
    [JsonPropertyName("origem")]
    public string Origem { get; set; }

    [JsonPropertyName("destino")]
    public string Destino { get; set; }

    [JsonPropertyName("servico")]
    public string Servico { get; set; }

    [JsonPropertyName("tipo")]
    public string Tipo { get; set; }
}
