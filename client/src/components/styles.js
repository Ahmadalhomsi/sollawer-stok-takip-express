export const filterStyle = {
  marginBottom: 2, // Equivalent to 16px
  marginLeft: 2, // Equivalent to 10px
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ffd800', // Outline color in the default state
    },
    '&:hover fieldset': {
      borderColor: '#ffb400', // Outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffd800', // Outline color when focused
    },

  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff9900', // Label color when focused
  },
};

export const mainButtonStyle = {
  marginBottom: 2, // Equivalent to 16px
  backgroundColor: '#ffd800',
  color: '#000', // Set text color to black for better contrast
  '&:hover': {
    backgroundColor: '#e6c300', // Darken the yellow on hover
  },
  height: '40px',
}

export const autocompleteStyle = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#ffb400', // Outline color on hover
    },
    '& fieldset': {
      borderColor: '#ffd800', // Outline color in the default state
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffd800', // Outline color when focused
    },
  },
  '& .MuiInputLabel-root': {
    color: '#CEAF03', // Label color in the default state
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff9900', // Label color when focused
  },
}

export const modalButtonStyle = {
  marginBottom: 2, // Equivalent to 16px
  backgroundColor: '#ffd800',
  color: '#000', // Set text color to black for better contrast
  '&:hover': {
    backgroundColor: '#D1B200', // Darken the yellow on hover
  },
  height: '40px',
}

export const modalCloseButtonStyle = {
  marginBottom: 2, // Equivalent to 16px
  backgroundColor: '#A3A3A3',
  color: '#000', // Set text color to black for better contrast
  '&:hover': {
    backgroundColor: '#8B8B8B', // Darken the yellow on hover
  },
  height: '40px',
}


export const numberStyle = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#ffb400', // Outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffd800', // Outline color when focused
    },
  },
  '& .MuiInputLabel-root': {
    color: '#CEAF03', // Label color in the default state
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff9900', // Label color when focused
  },
};


export const ModalNewFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ffd800', // Outline color in the default state
    },
    '&:hover fieldset': {
      borderColor: '#ffb400', // Outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffd800', // Outline color when focused
    },

  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff9900', // Label color when focused
  },
};


export const checkboxStyle = {
  color: '#CEAF03',
  '&.Mui-checked': {
    color: '#CEAF03',
  },
};
