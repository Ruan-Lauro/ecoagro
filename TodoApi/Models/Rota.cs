using System.Text.Json.Serialization;

public class Rota
{
    [JsonPropertyName("origem")]
    public string Origem { get; set; }

    [JsonPropertyName("destino")]
    public string Destino { get; set; }

    [JsonPropertyName("rota")]
    public string DescricaoRota { get; set; }
}
