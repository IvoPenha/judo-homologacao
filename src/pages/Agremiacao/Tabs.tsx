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
    <Grid item xs={12} sx={{  }}>
      <Tabs
        value={valueTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{ backgroundColor: '#FFFFFF', width: '100%', position: 'absolute',top:60, left: 0 }}
      >
        <Tab
          label="Listagem"
          component={Link}
          to="/agremiacao"
          sx={{
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            ml: 4
          }}
        />
        <Tab
          label="Detalhes"
          component={Link}
          disabled
          to={id ? `agremiacao/editar/${id}` : "/agremiacao/cadastro"}
          sx={{
            padding: 3,
            borderRight: '1px solid #ccc'
          }}
        />
      </Tabs>
    </Grid>
  );
}