import React from 'react'

const LanguageChip = ({language,languageColor,languageBgColor,className}) => {
  return (
    <span className={className} style={{backgroundColor: languageBgColor,color:languageColor}} >
        {language}
    </span>
  )
}

export default LanguageChip