import { useState } from 'react'

function App() {
  const [selectedStores, setSelectedStores] = useState([])
  const [selectedDiets, setSelectedDiets] = useState([])

  const groceryStores = [
    'Walmart',
    'Target',
    'Kroger',
    'Whole Foods',
    'Safeway',
    "Trader Joe's",
    'Costco',
    'Aldi'
  ]

  const dietaryRestrictions = [
    'Vegan',
    'Vegetarian',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Nut-Free',
    'Low-Carb',
    'Halal',
    'Kosher',
    'Low-Sodium',
    'Pescatarian'
  ]

  const toggleStore = (store) => {
    setSelectedStores(prev =>
      prev.includes(store)
        ? prev.filter(s => s !== store)
        : [...prev, store]
    )
  }

  const toggleDiet = (diet) => {
    setSelectedDiets(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    )
  }

  const handleFindRecipe = () => {
    console.log('Selected Stores:', selectedStores)
    console.log('Selected Dietary Restrictions:', selectedDiets)

    alert(
      `Finding recipes...\n\nStores: ${selectedStores.join(', ') || 'None'}\nDietary: ${selectedDiets.join(', ') || 'None'}`
    )
  }

  return (
    <div className="bg-white font-body text-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-4">
            RecipeFind
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Discover recipes tailored to your needs
          </p>
        </header>

        {/* Main Content */}
        <main>
          {/* Grocery Stores Section */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-semibold mb-6 text-gray-900">
              Nearby Grocery Stores
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {groceryStores.map((store) => (
                <button
                  key={store}
                  onClick={() => toggleStore(store)}
                  className={`border-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    selectedStores.includes(store)
                      ? 'border-primary bg-background text-primary'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>
          </section>

          {/* Dietary Restrictions Section */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-semibold mb-6 text-gray-900">
              Dietary Restrictions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {dietaryRestrictions.map((diet) => (
                <button
                  key={diet}
                  onClick={() => toggleDiet(diet)}
                  className={`border-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    selectedDiets.includes(diet)
                      ? 'border-secondary bg-background text-primary'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-secondary hover:bg-background hover:text-primary'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </section>

          {/* Find Recipe Button */}
          <section className="text-center">
            <button
              onClick={handleFindRecipe}
              className="bg-primary hover:bg-red-700 text-white font-heading text-xl font-semibold px-16 py-5 rounded-lg transition-colors duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            >
              Find Recipe
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-gray-500">
          <p>Select your preferences and discover delicious recipes</p>
        </footer>
      </div>
    </div>
  )
}

export default App
