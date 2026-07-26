'use client'

import { useState } from 'react'

export function NeuronLab() {
  const [weight, setWeight] = useState(0.5)
  const light = 0.8
  const score = light * weight - 0.2
  const active = score > 0

  return (
    <div className="deck-demo grid gap-4 rounded-xl border bg-card p-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex items-center gap-4 rounded-lg bg-secondary/60 p-5">
        <Node label="Lumière" value={light.toFixed(1)} />
        <span className="font-mono text-primary">× {weight.toFixed(1)}</span>
        <span className="text-muted-foreground">− 0,2</span>
        <span className="text-primary">→</span>
        <div className={`rounded-full border-2 px-5 py-4 text-center transition-all ${active ? 'border-primary bg-primary/15 shadow-[0_0_0_5px_var(--primary)] shadow-primary/10' : 'border-border'}`}>
          <div className="font-mono text-xl font-bold">{score.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">{active ? 'activé' : 'éteint'}</div>
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <label htmlFor="weight" className="font-mono text-xs uppercase tracking-wider text-primary">Poids de la connexion</label>
        <input id="weight" type="range" min="-1" max="1" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} className="mt-4 w-full accent-[var(--primary)]" />
        <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground"><span>−1 : freine</span><span>+1 : renforce</span></div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Entraîner le réseau, c’est ajuster ces poids jusqu’à produire de meilleures réponses.</p>
      </div>
    </div>
  )
}

function Node({ label, value }: { label: string; value: string }) {
  return <div className="rounded-full border bg-background px-5 py-4 text-center"><div className="font-mono text-xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
}
