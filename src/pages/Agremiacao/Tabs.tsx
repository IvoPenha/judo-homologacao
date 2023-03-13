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
    <Grid item xs={11} sx={{  }}>
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
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            ml: 3,
            textTransform:'initial',
            fontSize: '.9rem',
            height:'4rem',
            fontWeight: 'medium',
            letterSpacing:'0.075em'
          }}
        />
        <Tab
          label="Detalhes"
          component={Link}
          disabled
          to={id ? `agremiacao/editar/${id}` : "/agremiacao/cadastro"}
          sx={{
            borderRight: '1px solid #ccc',
            textTransform:'initial',
            fontSize: '.9rem',
            fontWeight: 'medium',
            letterSpacing:'0.075em'
            
          }}
        />
      </Tabs>
    </Grid>
  );
}