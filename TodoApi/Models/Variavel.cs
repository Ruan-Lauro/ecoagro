using System.Text.Json.Serialization;

public class Variavel
{
    [JsonPropertyName("descricao")]
    public string Descricao { get; set; }

    [JsonPropertyName("nome")]
    public string Nome { get; set; }

    [JsonPropertyName("valor")]
    public string Valor { get; set; }
}
