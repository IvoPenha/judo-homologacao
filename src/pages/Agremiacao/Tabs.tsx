import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { Grid, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";

export function TabsAgremiacao() {
  const [valueTab, setValueTab] = useState<number>(0);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id !== undefined) {
      return setValueTab(1);
    }
  }, [id]);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  return (
    <Grid item xs={10} sx={{  }}>
      <Tabs
        value={valueTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        
        sx={{ backgroundColor: '#FFFFFF', width: '100%', position: 'absolute',top:60, left: 0,padding: 0 }}
      >
        <Tab
          label="Listagem"
          component={Link}
          to="/agremiacao"
          
          sx={{
            width: 142,
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            ml: 3,
            textTransform:'initial',
            fontSize: '1.25rem',
            height:'4rem',
            lineHeight:1.6,
            fontWeight: 500,
            letterSpacing:'0.0075em',
            fontFamily: "Roboto, sans-serif",
            'a':{fontFamily: "Roboto"}
          }}
          color="primary"
          
        />
        <Tab
          label="Detalhes"
          component={Link}
          to={id ? `agremiacao/editar/${id}` : "/agremiacao/cadastro"}
          sx={{
            width: 142,
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            textTransform:'none',
            fontSize: '1.25rem',
            lineHeight:'32px',
            fontWeight: 500,
            letterSpacing:'0.0075em',
            fontFamily: "Roboto, sans-serif",
            cursor: 'default',
            pointerEvents: 'none'
            
          }}
          
          color="primary"
        />
      </Tabs>
    </Grid>
  );
}