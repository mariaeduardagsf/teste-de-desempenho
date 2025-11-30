##  Análise Detalhada: Ponto de Degradação da API de Checkout

Com base no relatório técnico, apresento abaixo uma expansão da análise de desempenho, focando nos resultados dos testes de Estresse e Pico, com ênfase na identificação dos limites de capacidade da aplicação.

---

### 1. Detalhamento do Desempenho por Cenário

#### 1.1. [cite_start]Cenário I/O-Bound (Leve) - `/checkout/simple` [cite: 9]

[cite_start]O *endpoint* de I/O (simulando operações rápidas como leitura em cache [cite: 9]) demonstrou um desempenho altamente estável.

* [cite_start]**Capacidade Sustentável:** Foi confirmado o suporte estável ao pico de **300 VUsers** com latência média baixa[cite: 9].
* [cite_start]**Estimativa Máxima:** Estima-se que a capacidade máxima sustentável esteja na faixa de **500 a 700 VUsers** antes de falhar o SLA de 500ms (p95)[cite: 10].
* **Teste de Pico (Spike Test):**
    * [cite_start]O salto imediato para 300 VUsers resultou em um pico momentâneo do p95 de **~ 650ms** [cite: 42][cite_start], violando brevemente o SLA de 500ms[cite: 44].
    * [cite_start]No entanto, a latência se estabilizou rapidamente para **~ 210ms** durante o platô de 1 minuto em 300 VUsers [cite: 43][cite_start], comprovando a resiliência da API a picos de tráfego repentinos[cite: 44].

#### 1.2. [cite_start]Cenário CPU-Bound (Pesado) - `/checkout/crypto` [cite: 11]

[cite_start]O *endpoint* que executa cálculos pesados de *hash* (CPU-bound) [cite: 11] [cite_start]apresenta um *throughput* significativamente menor[cite: 11].

* [cite_start]**Capacidade Máxima:** A capacidade máxima antes da degradação exponencial foi detectada entre **150 a 200 VUsers**[cite: 12].
* [cite_start]**Ponto de Degradação:** O ponto onde a aplicação parou de escalar de forma sustentável foi identificado após **200 VUsers**[cite: 36].

---

### 2. Análise do Teste de Estresse (Breaking Point)

[cite_start]O teste de estresse (carga máxima de 1000 VUsers [cite: 28][cite_start]) no *endpoint* intensivo em CPU (/checkout/crypto [cite: 32][cite_start]) mapeou o ponto exato da falha do sistema[cite: 32].

#### [cite_start]Sumário da Execução (p95) [cite: 33]

| Carga (VUsers) | Latência p95 (`http_req_duration`) | Variação de Latência | Observação |
| :---: | :---: | :--- | :--- |
| **100 VUs** | [cite_start]310ms [cite: 33] | Base | [cite_start]Dentro do SLA de 500ms [cite: 10] |
| **200 VUs** | [cite_start]850ms [cite: 33] | + 540ms | [cite_start]**Ponto de Ruptura / Início da Degradação Exponencial** [cite: 36] |
| **500 VUs** | [cite_start]12.1s (12,100ms) [cite: 33] | + 11,250ms | [cite_start]Saturação completa do servidor [cite: 39] |

#### Indicadores de Falha (Sinais de Degradação Exponencial)

[cite_start]O sistema começou a mostrar sinais claros de falha (degradação exponencial da latência) [cite: 36] [cite_start]no momento em que a carga ultrapassou **200 VUsers**[cite: 36].

1.  [cite_start]**Salto da Latência (200 VUs a 500 VUs):** O p95 da latência saltou de ~ 850ms para ~ 4,000ms (4 segundos)[cite: 38].
2.  [cite_start]**Saturação Total (> 500 VUs):** Acima de 500 VUsers, o servidor saturou completamente, com latências superiores a 12.000ms (12 segundos) e o Rate of Requests per Second (RPS) caindo drasticamente [cite: 39][cite_start], indicando *Throttling* ou *Timeouts* massivos[cite: 39].

---

### 3. Conclusão Final

[cite_start]A **E-commerce Checkout API** é robusta para fluxos leves de I/O [cite: 9] [cite_start]e demonstra resiliência a picos de tráfego de até 300 VUsers[cite: 44]. [cite_start]No entanto, o principal desafio de *performance* reside no *endpoint* intensivo em CPU (`/checkout/crypto`) [cite: 11][cite_start], cujo **ponto de ruptura** em torno de **200 VUsers** [cite: 36] [cite_start]limita a capacidade geral da aplicação em cenários de processamento pesado[cite: 12].