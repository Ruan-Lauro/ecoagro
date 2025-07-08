public class AnaliseTransporte
    {
        public int Quantidade { get; set; }
        public string Formato { get; set; }
        public string Carregamento { get; set; }
        public string Origem { get; set; }
        public string Destino { get; set; }
        public double PortoOrigem { get; set; }
        public double PortoDestino { get; set; }
        public double TransitTime { get; set; }

        public double RelRodoviario { get; set; }
        public double RelPortaPorto { get; set; }
        public double RelAtivPorto { get; set; }
        public double RelCabotagem { get; set; }
        public double RelPortoPorta { get; set; }

        public double TotalRodoviario { get; set; }
        public double TotalMercosul { get; set; }
        public double Economia { get; set; }
        public double Arvores { get; set; }
        public double Gelo { get; set; }
        public int Caminhoes { get; set; }
        public double CreditoCarbono { get; set; }
    }