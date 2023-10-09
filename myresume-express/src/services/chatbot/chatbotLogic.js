const axios = require('axios');
const MAX_TOKENS = 20000;
const { getTopics, createResumeSummaryForTemplate } = require('../utils/dataUtils');
const { getSummaryData } = require('../utils/dataUtils');



async function optimizeData(data, recipientMessage, templateType = 'default') {
  console.log('########### Optimizing data for template type:', templateType, 'Data Preview:', JSON.stringify(data).substring(0, 100));
  try {

    if (templateType !== '' && templateType !== null) {
      templateType = templateType.replace(/"/g, '');
      console.log('########### recipientMessage: ', recipientMessage);
      let templateData = data.bots.find(type => type.type === templateType);
      console.log('########### templateData: ', templateType, JSON.stringify(templateData).substring(0, 100));
      // get topics from summary
      // const topics = getTopics(JSON.stringify(templateData.summary))
      // // get keywords from data
      // const response = await axios.post('http://localhost:3000/extract_keywords', {
      //     text: recipientMessage + ',' + topics,
      //     data: data
      // });

      // if (!response.status === 200) {
      //     throw new Error('Failed to extract keywords');
      // }
      // let DataFromkeywords = response.data;
      // console.log('DataFromkeywords:', DataFromkeywords);

      const placeholders = getTopics(JSON.stringify(templateData.summary));
      getSummaryData(data, placeholders)


      let resumeSummaryUpdated = createResumeSummaryForTemplate(data, templateData.summary);
      let enhancedMessages = getEnhancedMessages(templateData, recipientMessage, resumeSummaryUpdated);
      handleTokenCount(enhancedMessages);
      return enhancedMessages;
    }
  } catch (error) {
    console.error('Error during data optimization:', error.message);
  }
}


function getEnhancedMessages(templateData, recipientMessage, resumeSummaryUpdated) {
  templateData.messages.unshift({
    "role": "system",
    "content": "Summary: " + JSON.stringify(resumeSummaryUpdated)
  });
  templateData.messages.push({
    "role": "user",
    "content": "Message:" + JSON.stringify(recipientMessage)
  });
  console.log('########### EnhancedMessages templateData: ', JSON.stringify(templateData).substring(0, 200))
  return templateData.messages;
}



function handleTokenCount(templateData) {
  const tokenCount = JSON.stringify(templateData).length;
  console.log('########### Token count:', tokenCount, 'Template Data Preview:', JSON.stringify(templateData).substring(0, 100));

  if (tokenCount > MAX_TOKENS) {
    const assistantMessage = templateData.messages.find(msg => msg.role === 'assistant');
    assistantMessage.content = "My response is too long. Can you specify the area you're interested in?";
  }
}

module.exports = {
  optimizeData,
};