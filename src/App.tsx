import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const STORAGE_KEY = 'fighter-wallet-watchlist'

function getSavedFighters(): string[] {
  try {
    const savedFighters = localStorage.getItem(STORAGE_KEY)
    return savedFighters ? JSON.parse(savedFighters) : []
  } catch {
    return []
  }
}

function App() {
  const [fighters, setFighters] = useState<string[]>(getSavedFighters)
  const [fighterName, setFighterName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fighters))
  }, [fighters])

  function addFighter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = fighterName.trim()
    if (!name) return

    if (fighters.some((fighter) => fighter.toLowerCase() === name.toLowerCase())) {
      setMessage('This fighter is already on your watchlist.')
      return
    }

    setFighters((currentFighters) => [...currentFighters, name])
    setFighterName('')
    setMessage('')
  }

  function removeFighter(name: string) {
    setFighters((currentFighters) => currentFighters.filter((fighter) => fighter !== name))
  }

  return (
    <main className="app-shell">
      <section className="watchlist-panel" aria-labelledby="page-title">
        <p className="eyebrow">Fighter Wallet</p>
        <h1 id="page-title">Your fight watchlist</h1>
        <p className="intro">Add fighters you want to follow. Their upcoming fight alerts will appear here.</p>

        <form className="add-fighter-form" onSubmit={addFighter}>
          <label htmlFor="fighter-name">Fighter name</label>
          <div className="form-row">
            <input
              id="fighter-name"
              type="text"
              placeholder="e.g. Ilia Topuria"
              value={fighterName}
              onChange={(event) => {
                setFighterName(event.target.value)
                setMessage('')
              }}
            />
            <button type="submit">Add fighter</button>
          </div>
          {message && <p className="form-message" role="alert">{message}</p>}
        </form>

        <section className="fighters-section" aria-labelledby="watchlist-title">
          <div className="section-heading">
            <h2 id="watchlist-title">Watching</h2>
            <span>{fighters.length}</span>
          </div>

          {fighters.length === 0 ? (
            <p className="empty-state">Your watchlist is empty. Add your first fighter above.</p>
          ) : (
            <ul className="fighter-list">
              {fighters.map((fighter) => (
                <li key={fighter}>
                  <span className="fighter-avatar" aria-hidden="true">🥊</span>
                  <span>{fighter}</span>
                  <button className="remove-button" type="button" onClick={() => removeFighter(fighter)} aria-label={`Remove ${fighter} from watchlist`}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
