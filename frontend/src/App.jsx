import { useState } from 'react'

function App() {
  const [selectedStores, setSelectedStores] = useState([])
  const [selectedDiets, setSelectedDiets] = useState([])
  const [isSearching, setIsSearching] = useState(false)

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
    setIsSearching(true)
  }

  const handleBack = () => {
    setIsSearching(false)
  }

  // Skeleton Loading Page
  if (isSearching) {
    return (
      <div className="bg-white font-body text-text min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-4">
              RecipeFind
            </h1>
          </header>

          {/* Loading Content */}
          <main className="text-center">
            <div className="mb-8">
              {/* Animated spinner */}
              <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>

              <h2 className="font-heading text-3xl font-semibold text-gray-900 mb-4">
                Finding Perfect Recipes...
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                We're searching through thousands of recipes to find the best matches for your preferences
              </p>

              {/* Selected preferences display */}
              <div className="max-w-2xl mx-auto text-left space-y-4 mb-12">
                {selectedStores.length > 0 && (
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <h3 className="font-heading font-semibold text-gray-900 mb-2">Selected Stores:</h3>
                    <p className="text-gray-700">{selectedStores.join(', ')}</p>
                  </div>
                )}

                {selectedDiets.length > 0 && (
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <h3 className="font-heading font-semibold text-gray-900 mb-2">Dietary Restrictions:</h3>
                    <p className="text-gray-700">{selectedDiets.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Skeleton recipe cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
                className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-heading text-lg font-semibold px-12 py-4 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Back to Search
              </button>
            </div>
          </main>
        </div>
      </div>
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
