module.exports = function(content) {
  return `html { 
    height: 100%; background: #FFF; 
  }
  
  ${content}`;
};