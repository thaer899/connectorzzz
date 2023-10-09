const jsonQuery = require('json-query');

function getTopics(data) {
  const topics = data.split(',').map(topic => topic.trim());
  console.log('########### topics: ', JSON.stringify(topics));
  return topics;
}


function createResumeSummaryForTemplate(data, templateSummary) {
  console.log('########### Creating resume summary, Data Preview:',);
  const placeholders = getTopics(templateSummary);

  const summary = placeholders.reduce((acc, placeholder) => {
    if (!data.hasOwnProperty(placeholder)) {
      console.log(`Warning: placeholder ${placeholder} not found in data.`);
      return acc ? `${acc}, ${placeholder}` : placeholder;
    }
    const dataStr = typeof data[placeholder] === 'string' ? data[placeholder] : JSON.stringify(data[placeholder]);
    return acc ? `${acc}, ${dataStr}` : dataStr;
  }, "");
  console.log('########### Summary:', JSON.stringify(summary).substring(0, 100));

  return summary;
}

function getSummaryData(data, placeholders) {
  const summaries = placeholders.map(placeholder => {
    // Convert placeholder to query path
    const queryPath = placeholder.replace(/\./g, '/');
    const value = jsonQuery(queryPath, { data }).value;

    let summary;
    if (Array.isArray(value)) {
      // Check if the array contains objects and handle them specially
      if (value.length > 0 && typeof value[0] === 'object') {
        summary = value.map(obj => {
          // Handle each object based on its properties
          if ('type' in obj && 'list' in obj) {
            return `${obj.type}: ${obj.list.join(', ')}`;
          }
          // Fallback to converting the object to a string
          return JSON.stringify(obj);
        }).join('; ');
      } else {
        summary = value.join(', ');
      }
    } else if (typeof value === 'object' && value !== null) {
      summary = JSON.stringify(value);
    } else {
      summary = value || 'Data not available';
    }

    return `${placeholder}: ${summary}`;
  });

  const prompt = summaries.join('\n');
  console.log('########### Prompt:', JSON.stringify(prompt).substring(0, 100));
}


module.exports = {
  getTopics,
  createResumeSummaryForTemplate,
  getSummaryData
};