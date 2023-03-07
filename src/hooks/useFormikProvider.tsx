import { useContext } from 'react';
import { FormikContext } from '../providers/context/FormikContext';

export function useFormikProvider() {
  const context = useContext(FormikContext);

  const {
    // AgremiacaoFilterFormik,
    // AgremiacaoRegisterFormik,
    filtersAgremiacao,
    setFiltersAgremiacao,
    filtersToPost,
    handleFilterChange,
    setFiltersToPost,
    valuesFiltered,
    setValuesFiltered,
    notes,
    setNotes,
    files,
    handleChangeFile,
    currentFileToCreate,
    setCurrentFileToCreate
  } = context;

  return {
    // AgremiacaoFilterFormik,
    // AgremiacaoRegisterFormik,
    filtersAgremiacao,
    setFiltersAgremiacao,
    filtersToPost,
    setFiltersToPost,
    handleFilterChange,
    valuesFiltered,
    setValuesFiltered,
    notes,
    setNotes,
    files,
    handleChangeFile,
    currentFileToCreate,
    setCurrentFileToCreate
  };
}