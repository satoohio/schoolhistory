import './App.css'

const events = [
  { year: '3000 BC', title: 'Ancient Egypt', description: 'The Old Kingdom of Egypt begins, with pharaohs ruling and pyramids being built.' },
  { year: '776 BC', title: 'First Olympics', description: 'The ancient Olympic Games are held for the first time in Olympia, Greece.' },
  { year: '44 BC', title: 'Julius Caesar', description: 'Julius Caesar is assassinated on the Ides of March, reshaping the Roman Republic.' },
  { year: '1066', title: 'Battle of Hastings', description: 'William the Conqueror defeats King Harold II, changing the course of English history.' },
  { year: '1215', title: 'Magna Carta', description: 'King John of England signs the Magna Carta, a foundational document of individual rights.' },
  { year: '1492', title: 'Columbus reaches America', description: 'Christopher Columbus lands in the Caribbean, connecting the Old and New Worlds.' },
  { year: '1687', title: 'Newton\'s Principia', description: 'Isaac Newton publishes his laws of motion and universal gravitation.' },
  { year: '1776', title: 'American Independence', description: 'The United States declares independence from Britain on July 4th.' },
  { year: '1865', title: 'End of the Civil War', description: 'The American Civil War ends with Union victory and the abolition of slavery.' },
  { year: '1969', title: 'Moon Landing', description: 'Apollo 11 lands on the Moon. Neil Armstrong takes humanity\'s first steps on another world.' },
]

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>School History</h1>
        <p>A timeline of world history's most important moments</p>
      </header>
      <main className="timeline">
        {events.map((event, i) => (
          <div key={i} className="event">
            <div className="event-year">{event.year}</div>
            <div className="event-dot" />
            <div className="event-card">
              <h2>{event.title}</h2>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
