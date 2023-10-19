async function createLlamaCompletion(prompt) {
  try {
    const { pipeline } = await import('@xenova/transformers');
    const pipe = await pipeline('text-generation', 'Xenova/LaMini-Flan-T5-783M');
    const response = await pipe(prompt);
    return response;
  } catch (error) {
    console.error("Error during model inference:", error);
    return null;
  }
}

module.exports = {
  createLlamaCompletion,
};
