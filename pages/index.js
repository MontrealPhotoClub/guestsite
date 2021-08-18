import SignupCard from '../components/SignupCard'
import FounderWord from '../components/FounderWord'

export default function Home() {
  return (
    <div>
      <main className="grid grid-flow-row pt-16 gap-y-32">
        <SignupCard />
        <FounderWord />
      </main>
    </div>
  )
}
