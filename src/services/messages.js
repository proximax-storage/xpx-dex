export default {
  ws: {
    aggregateBondedAdded: 'Transaction Aggregate Bonded Added',
    aggregateBondedRemoved: 'Transaction Aggregate Bonded Removed',
    cosignatureAdded: 'Cosignature Added',
    confirmed: 'Transaction confirmed',
    unconfirmed: 'Please wait a moment while the transaction is confirmed',
    unconfirmedRemoved: 'Transaction unconfirmed removed'
  },
  login: {
    success: {
      welcomeToProxiEDI: 'Welcome to ProxiEDI System'
    },
    error: {
      invalidUserOrPassword: 'Invalid email and password combination'
    }
  },
  accountActivation: {
    success: {
      accountSent: 'Request sent. Account pending for activation'
    },
    error: {
      accountSent: 'Error activating account'
    }
  },
  general: {
    success: {
      copy: 'Copied'
    },
    error: {
      copy: 'Copy failed'
    }
  },
  wallet: {
    error: {
      exist: 'Wallet name already exists, try another name',
      decrypt: 'Error to decrypt wallet'
    }
  },
  file: {
    success: {
      save: 'El archivo se adjuntó',
      attach: 'El archivo se adjuntó con éxito',
      load: 'Archivo/s adjuntó con éxito'
    },
    error: {
      error: 'Error al intentar cargar el archivo',
      empty: 'Archivo vacío',
      load: 'Ocurrió un error en la carga del archivo',
      format: 'Formato no permitido',
      header: 'Encabezado del archivo no es válido',
      length: 'Cantidad de archivo permitido',
      size: 'El tamaño permitido para un archivo es de ',
      conection: 'Error de conexión'
    }
  },
  nodes: {
    success: {
      statusNode: {
        online: 'Online',
        offline: 'Offline',
        connecting: 'Connecting...'
      }
    },
    error: {
      stuck: 'Node is stagnant',
      sync: 'Node is synchronizing',
      off: 'Node connection has been closed',
      valid: 'Node is not valid',
      exist: 'Node is already in the list',
      slow: 'Node connection is very slow'
    }
  },
  company: {
    success: {
      activate: 'Company successfully activated',
      deleted: 'Company successfully eliminated',
      edited: 'Company edited successfully'
    },
    error: {
      activate: 'Error when trying to activate the company',
      deleted: 'Error trying to delete the company',
      edited: 'Error when trying to edit the company'
    }
  },
  users: {
    success: {
      create: 'User created successfully',
      update: 'User edited successfully',
      delete: 'User deleted successfully'
    },
    error: {
      create: 'An error occurred while trying to create the user',
      update: 'An error occurred while trying to edit the user',
      delete: 'An error occurred while trying to delete the user'
    }
  }
}
