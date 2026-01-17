import { useState } from 'react'
import config from './config'

function App() {
  const [selectedStores, setSelectedStores] = useState([])
  const [selectedDiets, setSelectedDiets] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [recipes, setRecipes] = useState(null)
  const [error, setError] = useState(null)
  const [taskId, setTaskId] = useState(null)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

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

  const buildPrompt = (stores, diets) => {
    let prompt = "I need help finding recipes based on my grocery stores and dietary preferences.\n\n";

    if (stores.length > 0) {
      prompt += `I shop at the following stores: ${stores.join(', ')}.\n`;
      prompt += "Please use the available tools to check what items are on sale at these stores.\n\n";
    }

    if (diets.length > 0) {
      prompt += `I have the following dietary restrictions: ${diets.join(', ')}.\n`;
      prompt += "Please ensure all recipe recommendations comply with these dietary requirements.\n\n";
    }

    prompt += "Based on the sale items available and my dietary restrictions, please:\n";
    prompt += "1. Find what groceries are currently on sale at my selected stores\n";
    prompt += "2. Generate 3-5 recipe recommendations that:\n";
    prompt += "   - Use ingredients that are on sale\n";
    prompt += "   - Comply with my dietary restrictions\n";
    prompt += "   - Include the recipe name, ingredients list, and brief cooking instructions\n";
    prompt += "   - Show estimated cost based on sale prices\n\n";
    prompt += "Please provide detailed, practical recipes I can make this week.";

    return prompt;
  }

  const submitTask = async (prompt) => {
    const formData = new FormData();
    formData.append('agent_name', 'OrchestratorAgent');
    formData.append('prompt', prompt);

    const response = await fetch(`${config.apiUrl}/api/v2/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to submit task: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.taskId;
  }

  const pollTask = async (taskId) => {
    const response = await fetch(`${config.apiUrl}/api/v2/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to poll task: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  const pollUntilComplete = async (taskId) => {
    const startTime = Date.now();
    const maxAttempts = Math.floor(config.pollingTimeout / config.pollingInterval);
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      setPollingAttempts(attempts);

      const elapsed = Date.now() - startTime;
      if (elapsed > config.pollingTimeout) {
        throw new Error('Request timed out after 5 minutes. Please try again.');
      }

      try {
        const taskData = await pollTask(taskId);

        if (taskData.status.state === 'in-progress') {
          setStatusMessage(`Processing your request... (${Math.floor(elapsed / 1000)}s)`);
        }

        if (taskData.status.state === 'completed') {
          return taskData;
        }

        if (taskData.status.state === 'failed') {
          const errorMsg = taskData.status.message?.parts?.[0]?.text || 'Task failed';
          throw new Error(`Task failed: ${errorMsg}`);
        }

        await new Promise(resolve => setTimeout(resolve, config.pollingInterval));

      } catch (pollError) {
        if (attempts >= maxAttempts) {
          throw pollError;
        }
        await new Promise(resolve => setTimeout(resolve, config.pollingInterval));
      }
    }

    throw new Error('Maximum polling attempts reached. Please try again.');
  }

  const parseRecipeResponse = (taskData) => {
    const textContent = taskData.status?.message?.parts?.[0]?.text || '';

    return {
      rawText: textContent,
      timestamp: taskData.status?.timestamp,
      artifacts: taskData.artifacts || [],
      metadata: taskData.metadata || {},
    };
  }

  const handleFindRecipe = async () => {
    console.log('Selected Stores:', selectedStores)
    console.log('Selected Dietary Restrictions:', selectedDiets)

    setIsSearching(true)
    setError(null)
    setRecipes(null)
    setTaskId(null)
    setPollingAttempts(0)
    setStatusMessage('Submitting your request...')

    try {
      // Build prompt
      const prompt = buildPrompt(selectedStores, selectedDiets);
      console.log('Generated prompt:', prompt);

      // Submit task
      setStatusMessage('Submitting to recipe agent...')
      const newTaskId = await submitTask(prompt);
      setTaskId(newTaskId);
      console.log('Task submitted with ID:', newTaskId);

      // Poll until complete
      setStatusMessage('Waiting for recipes...')
      const completedTask = await pollUntilComplete(newTaskId);
      console.log('Task completed:', completedTask);

      // Parse and display results
      const parsedRecipes = parseRecipeResponse(completedTask);
      setRecipes(parsedRecipes);
      setStatusMessage('Recipes found!')

    } catch (err) {
      console.error('Error fetching recipes:', err)
      setError(err.message || 'Failed to fetch recipes. Please try again.')
      setIsSearching(false)
    }
  }

  const handleBack = () => {
    setIsSearching(false)
    setRecipes(null)
    setError(null)
  }

  // Skeleton Loading Page / Results Page
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
              {/* Error State */}
              {error && (
                <div className="mb-8">
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                    <h2 className="font-heading text-2xl font-semibold text-red-700 mb-2">
                      Error
                    </h2>
                    <p className="text-red-600 mb-4">{error}</p>

                    <div className="text-sm text-red-600 mt-4">
                      <p className="font-semibold mb-2">Troubleshooting tips:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Check if the backend server is running on port 8080</li>
                        <li>Verify your internet connection</li>
                        <li>Try selecting fewer stores or dietary restrictions</li>
                        <li>If timeout occurred, the request may be too complex - try again</li>
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={handleBack}
                    className="bg-primary hover:bg-red-700 text-white font-heading text-lg font-semibold px-12 py-4 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Back to Search
                  </button>
                </div>
              )}

              {/* Loading State */}
              {!error && !recipes && (
                <>
                  {/* Animated spinner */}
                  <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>

                  <h2 className="font-heading text-3xl font-semibold text-gray-900 mb-4">
                    Finding Perfect Recipes...
                  </h2>

                  {statusMessage && (
                    <p className="text-md text-primary font-semibold mb-2">
                      {statusMessage}
                    </p>
                  )}

                  {pollingAttempts > 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      Checking for results... (attempt {pollingAttempts})
                    </p>
                  )}

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
                </>
              )}

              {/* Success State with Results */}
              {!error && recipes && (
                <div>
                  <h2 className="font-heading text-3xl font-semibold text-gray-900 mb-4">
                    Recipes Found!
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Here are your personalized recipe recommendations
                  </p>

                  {/* Display recipe data */}
                  <div className="bg-background rounded-lg p-6 mb-8 border border-border">
                    <div className="text-left whitespace-pre-wrap text-sm leading-relaxed">
                      {recipes.rawText}
                    </div>
                  </div>

                  {recipes.metadata && Object.keys(recipes.metadata).length > 0 && (
                    <details className="mb-4">
                      <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                        Show Technical Details
                      </summary>
                      <div className="bg-gray-50 rounded-lg p-4 mt-2">
                        <pre className="text-left overflow-auto text-xs">
                          {JSON.stringify(recipes.metadata, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}

                  <button
                    onClick={handleBack}
                    className="bg-primary hover:bg-red-700 text-white font-heading text-lg font-semibold px-12 py-4 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Back to Search
                  </button>
                </div>
              )}
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
