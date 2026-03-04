import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { animateScroll } from 'react-scroll'
import data from './data.json'
import ReactMarkdown from 'react-markdown'

export default function FaqPage() {
  useEffect(() => {
    animateScroll.scrollToTop({ duration: 0 })
  }, [])

  const [expanded, setExpanded] = useState<string | false>('')

  const getData = () => {
    return data.map(({question, answer}, index) => {
      const panelId = `panel${index}`
      return (
          <Accordion key={panelId}
                     sx={{ marginBottom: '1em' }}
                     expanded={expanded === panelId}
                     onChange={handleChange(panelId)}>
            <AccordionSummary
                sx={{
                  borderBottom: '1px solid rgba(0, 0, 0, .125)',
                  marginBottom: -1,
                  minHeight: 56,
                  '&.Mui-expanded': {
                    minHeight: 56
                  },
                  '& .MuiAccordionSummary-content': {
                    '&.Mui-expanded': {
                      margin: '12px 0'
                    }
                  }
                }}
                aria-controls={`${panelId}d-content`}
                id={`${panelId}d-header`}
                expandIcon={<ExpandMoreIcon/>}>
              <Typography><ReactMarkdown>{question}</ReactMarkdown></Typography>
            </AccordionSummary>
            <AccordionDetails sx={(theme) => ({
              padding: theme.spacing(2),
              backgroundColor: 'rgba(0, 0, 0, .03)'
            })}>
              <Typography><ReactMarkdown linkTarget={() => '_blank'}>{answer}</ReactMarkdown></Typography>
            </AccordionDetails>
          </Accordion>
      )
    })
  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
      <div className='mx-lg-5 mx-3 my-3'>
        <div className='text-center mb-3'>
          <img src="/img/faq/faq.png" alt='' className='img-fluid'/>
        </div>
        { getData() }
      </div>
  )
}
