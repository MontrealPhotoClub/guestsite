import SignupCard from '../components/SignupCard'
import FounderWord from '../components/FounderWord'

export default function Home() {
  return (
    <div>
      <main className="grid grid-flow-row pt-16 gap-y-32">
        <div className="grid grid-flow-row px-2 gap-y-16">
          <h1 className="text-4xl font-bold sm:text-5xl">
            We're a friendly gathering of photographers and we're hosting
            regular events in Montréal.
          </h1>

          <SignupCard />
        </div>
        <FounderWord />
      </main>
    </div>
  )
}
