import { Snackbar, Alert } from "@mui/material";

interface SnackBarProps {
  AlertText: string;
  setAlertText: (error: string) => void;
}

const SnackBar: React.FC<SnackBarProps> = ({ AlertText, setAlertText }) => {

  return (
    <Snackbar
      // Doppia negazione (!!): Il primo ! inverte il valore, e il secondo ! lo riporta al valore originale in forma booleana.
      // (primo ! = Si apre se è falso che esiste un errore, secondo ! = si apre se è falso che non esiste un errore)
      open={!!AlertText} // Un valore booleano che determina se la snackbar è visibile o meno

      // Posizionamento della Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

      // ms di tempo prima dell'Auto-close della Snackbar
      autoHideDuration={null}

      // Gestione della chiusura della Snackbar
      // _ IGNORA "event"
      onClose={(_event, reason) => {
        if (reason === 'clickaway') {
          // Previene la chiusura quando si clicca altrove
          return;
        }
        setAlertText('');
      }}

    >

      {/* All'interno della Snackbar è presente un alert */}
      <Alert

        // Cliccare sul close dell'Alert, svuota AlertText, triggerando di conseguenza la scomparsa della Snackbar
        onClose={() => { setAlertText('') }}

        severity="error"
        sx={{
          width: '100%',
          height: '75px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {AlertText}
      </Alert>

    </Snackbar>
  );

};

export default SnackBar;