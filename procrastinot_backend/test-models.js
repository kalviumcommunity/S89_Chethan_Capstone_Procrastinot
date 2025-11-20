// Using built-in fetch

const API_KEY = 'AIzaSyDBqM3Ng0eRN_Tb_CWBAh8DTEUMpsB4Dss';

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`  Supports: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();