// Test plugin code
console.log('Test plugin loaded');

figma.showUI(__html__, { width: 300, height: 200 });

figma.ui.onmessage = async (msg) => {
  console.log('Plugin received message:', msg);
  
  if (msg.type === 'test-message') {
    console.log('Test message received successfully!');
    figma.ui.postMessage({
      type: 'test-response',
      message: 'Plugin communication working!'
    });
  }
}; 