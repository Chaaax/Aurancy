import { useForm } from "react-hook-form";
import "./FormularioSaving.css";

const FormularioSaving = ({ onSubmitSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        rendimentoMensal: parseFloat(data.rendimentoMensal),
        poupancaMensal: parseFloat(data.poupancaMensal),
        objetivoPoupanca: data.objetivoPoupanca,
        valorObjetivo: parseFloat(data.valorObjetivo), // ✅ NOVO CAMPO
        maioresGastos: Array.isArray(data.maioresGastos) ? data.maioresGastos : [data.maioresGastos],
        categoriasReduzir: Array.isArray(data.categoriasReduzir) ? data.categoriasReduzir : [data.categoriasReduzir],
        nivelRisco: data.nivelRisco,
      };

      const res = await fetch("http://localhost:3000/api/saving", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao enviar dados");

      const resultado = await res.json();
      console.log("Resposta do backend:", resultado);
      alert("✅ Formulário enviado com sucesso!");

      if (onSubmitSuccess) onSubmitSuccess();

    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      alert("❌ Erro ao enviar. Ver consola.");
    }
  };

  return (
    <div className="formulario-saving">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>1. Rendimento mensal líquido (€)</label>
          <input type="number" step="0.01" {...register("rendimentoMensal", { required: "Campo obrigatório" })} />
          {errors.rendimentoMensal && <span className="error-text">{errors.rendimentoMensal.message}</span>}
        </div>

        <div>
          <label>2. Quanto consegues poupar por mês (€)?</label>
          <input type="number" step="0.01" {...register("poupancaMensal", { required: "Campo obrigatório" })} />
          {errors.poupancaMensal && <span className="error-text">{errors.poupancaMensal.message}</span>}
        </div>

        <div>
          <label>3. Tens algum objetivo de poupança?</label>
          <input type="text" {...register("objetivoPoupanca", { required: "Campo obrigatório" })} placeholder="Ex: Fundo de emergência, viagem..." />
          {errors.objetivoPoupanca && <span className="error-text">{errors.objetivoPoupanca.message}</span>}
        </div>

        <div>
          <label>4. Qual o valor desse objetivo (€)?</label>
          <input type="number" step="0.01" {...register("valorObjetivo", { required: "Campo obrigatório" })} placeholder="Ex: 10000" />
          {errors.valorObjetivo && <span className="error-text">{errors.valorObjetivo.message}</span>}
        </div>

        <div>
          <label>5. Maiores gastos mensais</label>
          <div className="checkbox-group">
            {["Renda", "Alimentação", "Transportes", "Subscrições", "Refeições fora", "Compras online", "Educação", "Outros"].map((cat) => (
              <label key={cat}>
                <input type="checkbox" value={cat} {...register("maioresGastos", { required: "Seleciona pelo menos uma opção" })} />
                {cat}
              </label>
            ))}
          </div>
          {errors.maioresGastos && <span className="error-text">{errors.maioresGastos.message}</span>}
        </div>

        <div>
          <label>6. Estarias disposto a reduzir gastos em:</label>
          <div className="checkbox-group">
            {["Renda", "Alimentação", "Transportes", "Subscrições", "Refeições fora", "Compras online", "Educação", "Outros"].map((cat) => (
              <label key={cat}>
                <input type="checkbox" value={cat} {...register("categoriasReduzir", { required: "Seleciona pelo menos uma opção" })} />
                {cat}
              </label>
            ))}
          </div>
          {errors.categoriasReduzir && <span className="error-text">{errors.categoriasReduzir.message}</span>}
        </div>

        <div>
          <label>7. Qual o teu perfil de risco?</label>
          <div className="radio-group">
            {["Conservador", "Moderado", "Ousado"].map((nivel) => (
              <label key={nivel}>
                <input type="radio" value={nivel} {...register("nivelRisco", { required: "Campo obrigatório" })} />
                {nivel}
              </label>
            ))}
          </div>
          {errors.nivelRisco && <span className="error-text">{errors.nivelRisco.message}</span>}
        </div>

        <button type="submit">Enviar Formulário</button>
      </form>
    </div>
  );
};

export default FormularioSaving;


