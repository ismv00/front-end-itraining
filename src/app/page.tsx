import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-[#0e0e0e] text-white min-h-screen font-sans">
      {/* NAV */}
      <nav className="flex justify-between items-center px-16 py-5 border-b border-white/5 sticky top-0 bg-[#0e0e0e] z-10">
        <span className="font-syne font-extrabold text-xl">
          i<span className="text-[#C8F04C]">Training</span>
        </span>
        <div className="flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Funcionalidades
          </a>
          <a
            href="#pricing"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Preços
          </a>
          <Link
            href="/login"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/login?tab=register"
            className="bg-[#C8F04C] text-[#0e0e0e] font-syne font-bold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-16 py-24 text-center border-b border-white/5">
        <div className="inline-flex items-center gap-2 bg-[#C8F04C]/8 border border-[#C8F04C]/20 rounded-full px-4 py-1.5 text-xs text-[#C8F04C] mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8F04C]" />
          Plataforma para personal trainers
        </div>
        <h1 className="font-syne font-extrabold text-6xl leading-tight tracking-tight max-w-3xl mx-auto mb-6">
          Gerencie seus alunos.
          <br />
          Foque no que <span className="text-[#C8F04C]">importa.</span>
        </h1>
        <p className="text-white/40 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Crie treinos personalizados, acompanhe a evolução dos seus alunos e
          organize tudo em um só lugar.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login?tab=register"
            className="bg-[#C8F04C] text-[#0e0e0e] font-syne font-bold text-sm px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            Começar agora — 15 dias grátis
          </Link>
          <a
            href="#features"
            className="border border-white/15 text-white font-syne font-semibold text-sm px-8 py-4 rounded-xl hover:border-white/40 transition-colors"
          >
            Ver funcionalidades
          </a>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-16 py-10 border-b border-white/5 flex justify-center gap-16">
        {[
          { num: "2.4k+", label: "alunos gerenciados" },
          { num: "380+", label: "personais ativos" },
          { num: "18k+", label: "treinos criados" },
          { num: "800+", label: "exercícios com imagem" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-syne font-extrabold text-3xl text-[#C8F04C]">
              {s.num}
            </p>
            <p className="text-xs text-white/25 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" className="px-16 py-20 border-b border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
          Funcionalidades
        </p>
        <h2 className="font-syne font-bold text-4xl mb-14 tracking-tight">
          Tudo que você precisa
          <br />
          para <span className="text-[#C8F04C]">treinar melhor</span>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: "Gestão de alunos",
              desc: "Cadastre alunos, acompanhe vínculos e gerencie sua base completa em um painel intuitivo.",
            },
            {
              title: "Treinos personalizados",
              desc: "Monte treinos completos com exercícios, séries, repetições e carga para cada aluno individualmente.",
            },
            {
              title: "App para o aluno",
              desc: "Seu aluno acessa os treinos pelo app, registra cargas executadas e acompanha sua evolução.",
            },
            {
              title: "Biblioteca de exercícios",
              desc: "Mais de 800 exercícios com imagens e instruções organizados por grupo muscular.",
            },
            {
              title: "Acompanhamento de carga",
              desc: "O aluno registra a carga executada e você acompanha a progressão de cada exercício.",
            },
            {
              title: "Acesso imediato",
              desc: "Cadastre um aluno e ele já acessa o app em segundos. Sem burocracia, sem complicação.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#151515] border border-white/5 rounded-2xl p-7 hover:border-[#C8F04C]/20 transition-colors"
            >
              <h3 className="font-syne font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-16 py-20 border-b border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
          Planos
        </p>
        <h2 className="font-syne font-bold text-4xl mb-14 tracking-tight">
          Preço <span className="text-[#C8F04C]">justo</span> para cada fase
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {[
            {
              name: "Starter",
              price: "14,90",
              students: "Até 5 alunos",
              desc: "Ideal para quem está começando",
              features: [
                "Até 5 alunos ativos",
                "Treinos ilimitados",
                "App para o aluno",
                "Biblioteca de exercícios",
                "Suporte por e-mail",
              ],
              featured: false,
            },
            {
              name: "Pro",
              price: "29,90",
              students: "Até 15 alunos",
              desc: "Para personais em crescimento",
              features: [
                "Até 15 alunos ativos",
                "Treinos ilimitados",
                "App para o aluno",
                "Biblioteca de exercícios",
                "Suporte prioritário",
              ],
              featured: true,
            },
            {
              name: "Elite",
              price: "59,90",
              students: "Alunos ilimitados",
              desc: "Para estúdios e personais consolidados",
              features: [
                "Alunos ilimitados",
                "Treinos ilimitados",
                "App para o aluno",
                "Biblioteca de exercícios",
                "Suporte prioritário",
                "Relatórios avançados",
              ],
              featured: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border ${plan.featured ? "border-[#C8F04C]/30 bg-[#151a0a]" : "border-white/5 bg-[#151515]"}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8F04C] text-[#0e0e0e] font-syne font-bold text-[10px] px-4 py-1 rounded-full">
                  ✦ Mais popular
                </div>
              )}
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">
                {plan.name}
              </p>
              <p className="font-syne font-extrabold text-4xl mb-1">
                <span className="text-lg font-normal text-white/40">R$ </span>
                {plan.price}
                <span className="text-sm font-normal text-white/30">/mês</span>
              </p>
              <p className="text-sm text-white/30 mb-6 pb-6 border-b border-white/5">
                {plan.desc}
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-white/60"
                  >
                    <span className="text-[#C8F04C] font-bold text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?tab=register"
                className={`block text-center py-3 rounded-xl font-syne font-bold text-sm transition-all ${
                  plan.featured
                    ? "bg-[#C8F04C] text-[#0e0e0e] hover:opacity-90"
                    : "border border-[#C8F04C]/30 text-[#C8F04C] hover:border-[#C8F04C]/60"
                }`}
              >
                Começar — 15 dias grátis
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-16 py-20 border-b border-white/5 max-w-3xl">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
          Dúvidas
        </p>
        <h2 className="font-syne font-bold text-4xl mb-12 tracking-tight">
          Perguntas <span className="text-[#C8F04C]">frequentes</span>
        </h2>
        {[
          {
            q: "Preciso de cartão de crédito para começar?",
            a: "Não. Você tem 15 dias grátis para testar sem precisar de cartão. O cartão só é necessário ao assinar um plano.",
          },
          {
            q: "Posso mudar de plano a qualquer momento?",
            a: "Sim. Você pode fazer upgrade ou downgrade do seu plano a qualquer momento, sem taxas adicionais.",
          },
          {
            q: "O meu aluno precisa pagar algo?",
            a: "Não. O app para o aluno é totalmente gratuito. Apenas o personal trainer paga pela assinatura.",
          },
          {
            q: "O app funciona no iPhone e Android?",
            a: "Sim. O app do aluno está disponível para iOS e Android.",
          },
          {
            q: "O que acontece após os 15 dias de teste?",
            a: "Você receberá um aviso e poderá escolher um plano para continuar. Caso não assine, sua conta será pausada mas seus dados ficam salvos por 30 dias.",
          },
        ].map((item) => (
          <div key={item.q} className="border-b border-white/5 py-5">
            <p className="font-syne font-bold text-base mb-2">{item.q}</p>
            <p className="text-sm text-white/35 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-16 py-24 text-center">
        <h2 className="font-syne font-extrabold text-5xl tracking-tight mb-4">
          Pronto para <span className="text-[#C8F04C]">transformar</span>
          <br />
          sua gestão?
        </h2>
        <p className="text-white/30 text-base mb-8">
          Comece hoje. 15 dias grátis, sem cartão de crédito.
        </p>
        <Link
          href="/login?tab=register"
          className="inline-block bg-[#C8F04C] text-[#0e0e0e] font-syne font-bold text-sm px-10 py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Criar conta grátis
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-16 py-6 border-t border-white/5 flex justify-between items-center">
        <span className="font-syne font-extrabold text-lg">
          i<span className="text-[#C8F04C]">Training</span>
        </span>
        <span className="text-xs text-white/20">
          © 2026 iTraining. Todos os direitos reservados.
        </span>
      </footer>
    </main>
  );
}
