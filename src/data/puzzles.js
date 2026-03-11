export const PUZZLES = [
  {
    id: 1,
    type: 'sequence',
    title: 'Patrón de Memoria',
    description: 'Repite la secuencia de impulsos para sincronizar el enlace neuronal.',
    difficulty: 'Fácil',
    points: 100,
    config: { colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981'], steps: 4 }
  },
  {
    id: 2,
    type: 'cipher',
    title: 'Desencriptación César',
    description: 'Aplica un desplazamiento de +3 a la clave para obtener el código de acceso.',
    difficulty: 'Medio',
    points: 250,
    config: { cipher: 'KHOOR', answer: 'HELLO' }
  },
  {
    id: 3,
    type: 'logic',
    title: 'Conexión de Nodos',
    description: 'Activa los interruptores para que la suma de energía sea exactamente 15.',
    difficulty: 'Medio',
    points: 500,
    config: { target: 15, nodes: [4, 7, 2, 8, 5] }
  },
  {
    id: 4,
    type: 'terminal',
    title: 'Inyección de Buffer',
    description: 'Identifica y haz clic en la cadena de código corrupta entre los datos basura.',
    difficulty: 'Difícil',
    points: 750,
    config: { target: '0xDEADBEEF', junk: ['0xFC33A2', '0x1A2B3C', '0x99FF00', '0xEE44BB', '0x001122'] }
  },
  {
    id: 5,
    type: 'maze',
    title: 'Laberinto Neural',
    description: 'Navega el nodo a través de la red hasta el núcleo sin tocar las paredes.',
    difficulty: 'Extremo',
    points: 1000,
    config: { size: 5, start: [0, 0], end: [4, 4], walls: [[1, 1], [1, 2], [3, 3], [3, 2], [2, 0]] }
  },
  {
    id: 6,
    type: 'sync',
    title: 'Sincronía de Pulso',
    description: 'Intercepta las señales en el momento exacto para estabilizar el núcleo.',
    difficulty: 'Extremo+',
    points: 1500,
    config: { speed: 3, count: 5 }
  },
  {
    id: 7,
    type: 'firewall',
    title: 'Brecha de Firewall',
    description: 'Sobrecarga los sectores del firewall rápidamente antes de que se reinicien.',
    difficulty: 'Épico',
    points: 2000,
    config: { sectors: 8, decayTime: 2000 }
  },
  {
    id: 8,
    type: 'command',
    title: 'Protocolo de Emergencia',
    description: 'Introduce la secuencia de comandos bajo presión para evitar el bloqueo del sistema.',
    difficulty: 'Imposible',
    points: 3000,
    config: { commands: ['FLUSH', 'REBOOT', 'BYPASS', 'OVERRIDE'], timeLimit: 10 }
  },
  {
    id: 9,
    type: 'boss',
    title: 'Convergencia Final',
    description: 'DOMINA EL CAOS. Mantén los tres núcleos estables simultáneamente para completar el enlace.',
    difficulty: 'DIOS',
    points: 5000,
    config: { 
      subPuzzles: [
        { type: 'sync', speed: 1.5, count: 3 },
        { type: 'firewall', sectors: 4, decayTime: 4000 },
        { type: 'cipher', cipher: 'BOSS', answer: 'BOSS' }
      ]
    }
  },
  // RECREATIONAL PROTOCOLS (EASY)
  {
    id: 10,
    type: 'parity',
    category: 'recreational',
    title: 'Filtro de Bits',
    description: 'Selecciona solo los números PARES para estabilizar el flujo.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { numbers: [2, 5, 8, 11, 14, 17, 20, 23], target: 'even' }
  },
  {
    id: 11,
    type: 'wordfind',
    category: 'recreational',
    title: 'Rastreador de Datos',
    description: 'Encuentra la palabra "CORE" en la matriz.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { 
      grid: [
        ['P','Q','A','L','X','Z','B','W'], 
        ['X','F','N','T','R','H','J','O'], 
        ['C','N','E','X','U','S','V','P'],
        ['K','M','G','L','R','I','T','D'],
        ['E','R','F','X','A','Y','Q','U'],
        ['U','P','N','E','X','O','Z','M']
      ], 
      target: 'NEXUS' 
    }
  },
  {
    id: 12,
    type: 'quickmath',
    category: 'recreational',
    title: 'Cálculo Aneuronal',
    description: 'Resuelve esta operación aritmética básica.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { operation: '12 + 8', answer: 20 }
  },
  {
    id: 13,
    type: 'colormatch',
    category: 'recreational',
    title: 'Disonancia Óptica',
    description: '¿Coincide el texto con el color visual?',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { text: 'VERDE', color: '#10b981', matches: true }
  },
  {
    id: 14,
    type: 'intruder',
    category: 'recreational',
    title: 'Detección de Intrusos',
    description: 'Selecciona el elemento que no encaja.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { items: ['🚀', '🚀', '🛸', '🚀'], targetIndex: 2 }
  },
  {
    id: 15,
    type: 'tapper',
    category: 'recreational',
    title: 'Pulso Cinético',
    description: 'Toca el núcleo 5 veces rápidamente.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { target: 5 }
  },
  {
    id: 16,
    type: 'flash',
    category: 'recreational',
    title: 'Memoria de Corto Plazo',
    description: '¿Qué icono viste hace un momento?',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { icon: 'Shield', options: ['Shield', 'Zap', 'Cpu'] }
  },
  {
    id: 17,
    type: 'order',
    category: 'recreational',
    title: 'Secuenciador',
    description: 'Ordena de menor a mayor.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { numbers: [15, 3, 9], answer: [3, 9, 15] }
  },
  {
    id: 18,
    type: 'echo',
    category: 'recreational',
    title: 'Eco Binario',
    description: 'Repite la señal (toca 3 veces).',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { pattern: [1, 1, 1] }
  },
  {
    id: 19,
    type: 'captcha',
    category: 'recreational',
    title: 'Verificación Humana',
    description: 'Introduce los caracteres de seguridad.',
    difficulty: 'Muy Fácil',
    points: 50,
    config: { code: 'A7K9' }
  },
  // CRITICAL EXPANSION
  {
    id: 20,
    type: 'lightsout',
    title: 'Apagador de Nodos',
    description: 'Apaga todos los nodos. Al alternar un nodo, normalmente afecta a sus adyacentes. (Excepción de protocolo: Si queda 1 último nodo vivo, al tocarlo morirá sin alertar a sus vecinos).',
    difficulty: 'Difícil',
    points: 1200,
    config: { initial: [false, true, false, true, true, true, false, true, false], size: 3 }
  },
  {
    id: 21,
    type: 'sliders',
    title: 'Alineación Cuántica',
    description: 'Sincroniza las frecuencias de radio. Pista oculta: [100 - X - Y = Z] (Estabilízalo exactamente a 25, 45, y 30)',
    difficulty: 'Medio',
    points: 800,
    config: { targets: [25, 45, 30] }
  },
  {
    id: 22,
    type: 'reaction',
    title: 'Maniobra Evasiva',
    description: 'Inicia el hiper-salto. Cuando el núcleo se vuelva ROJO, pulsa SALTO inmediatamente (tienes medio segundo).',
    difficulty: 'Extremo',
    points: 1500,
    config: {}
  },
  {
    id: 23,
    type: 'orbital',
    title: 'Alineación Orbital',
    description: 'Intercepta los tres satélites neuronales fijándolos en la zona de resonancia (parte superior) pulsando cuando pasen por ella.',
    difficulty: 'Muy Difícil',
    points: 2000,
    config: { speeds: [1.2, 2.5, 3.8], tolerance: 15 } // Tolerance in degrees
  },
  {
    id: 24,
    type: 'wave',
    title: 'Modulación Cuántica',
    description: 'Ajusta la Frecuencia y la Amplitud para replicar la señal de origen fantasma exactamente. [LOG INTERCEPTADO: "Parámetros óptimos fijados en f=5Hz, amp=80"]',
    difficulty: 'Medio',
    points: 1400,
    config: { targetFreq: 5, targetAmp: 80 }
  },
  { id: 25, type: 'binary_flip', category: 'critical', title: 'Sobrecarga Binaria', description: 'Introduce el valor (45) en binario encendiendo bloques. Pista: 32 + 8 + 4 + 1.', difficulty: 'Medio', points: 400, config: { target: 45, bits: 6 } },
  { id: 26, type: 'color_mixer', category: 'critical', title: 'Frecuencia Óptica', description: 'Iguala el tono mediante los 3 canales RGB. Pista: R=100, G=250, B=50.', difficulty: 'Fácil', points: 450, config: { r: 100, g: 250, b: 50, tolerance: 20 } },
  { id: 27, type: 'safe_crack', category: 'critical', title: 'Núcleo Aislado', description: 'Gira el seguro a las tres frecuencias. Log: [15] -> [35] -> [5].', difficulty: 'Fácil', points: 300, config: { sequence: [15, 35, 5] } },
  { id: 28, type: 'memory_grid', category: 'critical', title: 'Memoria Celular', description: 'Toca los 4 nodos iniciales. Log: [esquina izq-arr, nodo-6, nodo-11, esquina der-abj].', difficulty: 'Difícil', points: 700, config: { active: [0, 5, 10, 15], size: 4 } },
  { id: 29, type: 'arrow_seq', category: 'critical', title: 'Vector Direccional', description: 'Introduce la secuencia: Arriba, Arriba, Abajo, Izquierda, Derecha.', difficulty: 'Fácil', points: 300, config: { seq: ['UP', 'UP', 'DOWN', 'LEFT', 'RIGHT'] } },
  { id: 30, type: 'morse_code', category: 'critical', title: 'Transmisión SOS', description: 'Toca el CPU central: 3 pulsos CORTOS seguidos de 3 LARGOS.', difficulty: 'Medio', points: 600, config: { target: ['S','S','S','L','L','L'] } },
  { id: 31, type: 'timing_bar', category: 'critical', title: 'Aterrizaje Forzoso', description: 'Frena la señal en la zona verde central (70% - 80%).', difficulty: 'Medio', points: 350, config: { min: 70, max: 80 } },
  { id: 32, type: 'keypad_chaos', category: 'critical', title: 'Matriz Caótica', description: 'Presiona los números en orden ascendente del 1 al 9. ¡No parpadees!', difficulty: 'Difícil', points: 800, config: { max: 9 } },
  { id: 33, type: 'math_sum', category: 'critical', title: 'Balance de Carga', description: 'Selecciona 3 núcleos que sumen (85). Observando datos: 40 + 25 + 20 es clave.', difficulty: 'Medio', points: 600, config: { target: 85, choices: [10, 15, 20, 25, 30, 40, 45, 5, 50] } },
  { id: 34, type: 'crypto_slider', category: 'critical', title: 'Desfase Semántico', description: 'Desliza para descifrar el alias. Cifrado César offset: 4', difficulty: 'Fácil', points: 400, config: { offset: 4, target: 'NEXUS' } },
  { id: 35, type: 'wire_connect', category: 'critical', title: 'Enrutador de Conexiones', description: 'Toca un nombre a la izquierda y conéctalo con el destino (Derecha) correcto.', difficulty: 'Medio', points: 500, config: { pairs: ['Alpha-01', 'Beta-02', 'Gamma-03'] } },
  { id: 36, type: 'word_guess', category: 'critical', title: 'Inyección de Diccionario', description: 'Escribe la clave de 5 letras... es "CYBER".', difficulty: 'Fácil', points: 500, config: { answer: 'CYBER' } },
  { id: 37, type: 'laser_reflect', category: 'critical', title: 'Prisma Deflector', description: 'Gira los prismas para alinear el conducto. Geometría requerida: Vertical (|), Diagonal (/), Horizontal (-).', difficulty: 'Medio', points: 600, config: { angles: [0, 135, 90] } },
  { id: 38, type: 'radar_find', category: 'critical', title: 'Escáner Orbital', description: 'Pulsa Escanear cuando el radar pase a (180 grados).', difficulty: 'Medio', points: 400, config: { angle: 180 } },
  { id: 39, type: 'riddle', category: 'recreational', title: 'Esfinge Digital', description: 'Ingresa la respuesta: Soy el cerebro electrónico central de procesamiento...', difficulty: 'Muy Fácil', points: 100, config: { answer: 'CPU' } },
  { id: 40, type: 'pattern_lock', category: 'critical', title: 'Bloqueo Táctico', description: 'Dibuja un patrón desde abajo a la derecha: [8]->[5]->[2]->[1]->[0].', difficulty: 'Medio', points: 450, config: { seq: [8, 5, 2, 1, 0] } },
  { id: 41, type: 'boss_phase_2', category: 'critical', title: 'Sobrecarga de Servidores', description: 'FASE BOSS 2. Intercepta tres anomalías a la vez. (Binario:10 / Password:ROOTS / Bar:45-55)', difficulty: 'DIOS', points: 5000, config: { 
    subPuzzles: [
      { type: 'binary_flip', bits: 4, target: 10 },
      { type: 'word_guess', answer: 'ROOTS' },
      { type: 'timing_bar', min: 45, max: 55 }
    ]
  }},

  // ═══════════════════════════════════════════
  // RECREATIONAL EXPANSION V2 - FUN GAMES
  // ═══════════════════════════════════════════
  { id: 50, type: 'emoji_pairs', category: 'recreational', title: 'Memorama Cuántico', description: 'Encuentra los pares de emojis ocultos. ¡Memoriza las posiciones!', difficulty: 'Fácil', points: 150, config: { emojis: ['🧠','💀','🔮','⚡','🎯','🛸'] } },
  { id: 51, type: 'whack_mole', category: 'recreational', title: 'Caza de Glitches', description: 'Destruye 5 anomalías antes de que escapen. ¡Sé rápido!', difficulty: 'Medio', points: 200, config: { target: 5 } },
  { id: 52, type: 'typing_race', category: 'recreational', title: 'Velocidad Terminal', description: 'Teclea la palabra "ENIGMA" lo más rápido posible.', difficulty: 'Fácil', points: 100, config: { word: 'ENIGMA' } },
  { id: 53, type: 'coin_flip', category: 'recreational', title: 'Suerte Binaria', description: 'Adivina cara o cruz 3 veces seguidas. ¿Tienes suerte?', difficulty: 'Medio', points: 250, config: { streak: 3 } },
  { id: 54, type: 'rps', category: 'recreational', title: 'Duelo Heurístico', description: 'Gánale a la IA en Piedra, Papel o Tijera 2 veces seguidas.', difficulty: 'Medio', points: 200, config: { streak: 2 } },
  { id: 55, type: 'spot_diff', category: 'recreational', title: 'Pixel Corrupto', description: 'Encuentra el emoji diferente en la cuadrícula.', difficulty: 'Muy Fácil', points: 80, config: { emoji: '🔮', odd: '🟣', oddPos: 7 } },
  { id: 56, type: 'speed_click', category: 'recreational', title: 'Overclocking Manual', description: 'Haz 20 clicks en 5 segundos para sobrecargar el procesador.', difficulty: 'Difícil', points: 300, config: { target: 20, time: 5 } },
  { id: 57, type: 'word_scramble', category: 'recreational', title: 'Desfragmentación', description: 'Reordena las letras para formar la palabra correcta. Pista: Es el nombre de este juego.', difficulty: 'Fácil', points: 120, config: { word: 'NEXUS' } },
  { id: 58, type: 'trivia', category: 'recreational', title: 'Base de Conocimiento', description: '¿Cuál es el lenguaje de programación más usado en la web?', difficulty: 'Muy Fácil', points: 80, config: { question: '¿Cuál es el lenguaje de programación más usado en la web?', options: ['Python', 'JavaScript', 'Java', 'C++'], answer: 'JavaScript' } },
  { id: 59, type: 'dice_roll', category: 'recreational', title: 'Generador Aleatorio', description: 'Lanza los dados y reza por sacar un 7 en total.', difficulty: 'Medio', points: 200, config: { target: 7 } },
  { id: 60, type: 'color_guess', category: 'recreational', title: 'Espectro Cromático', description: 'Identifica el color mostrado en pantalla.', difficulty: 'Fácil', points: 100, config: { hex: '#a855f7', options: ['Rojo', 'Púrpura', 'Azul', 'Verde'], answer: 'Púrpura' } },
  { id: 61, type: 'bomb_timer', category: 'recreational', title: 'Desactivación', description: 'Detén el cronómetro entre 3 y 7 segundos. ¡No dejes que explote!', difficulty: 'Medio', points: 250, config: { min: 3, max: 7 } },
  { id: 62, type: 'pattern_repeat', category: 'recreational', title: 'Eco Neuronal', description: 'Observa la secuencia de celdas y repítela exactamente.', difficulty: 'Medio', points: 200, config: { length: 4 } },
  { id: 63, type: 'emoji_math', category: 'recreational', title: 'Aritmética Emoji', description: '🍎 + 🍎 + 🍎 = 15. ¿Cuánto vale 🍎?', difficulty: 'Fácil', points: 100, config: { equation: '🍎 + 🍎 + 🍎 = 15, 🍎 = ?', options: [3, 5, 7, 10], answer: 5 } },
  { id: 64, type: 'tower_stack', category: 'recreational', title: 'Torre de Datos', description: 'Apila 5 bloques en la zona verde. ¡Timing perfecto!', difficulty: 'Difícil', points: 350, config: { target: 5 } },
  { id: 65, type: 'trivia', category: 'recreational', title: 'Firewall Quiz', description: '¿Qué significa HTTP?', difficulty: 'Fácil', points: 100, config: { question: '¿Qué significa HTTP?', options: ['Hyper Text Transfer Protocol', 'High Tech Transfer Process', 'Hyper Terminal Text Program', 'Home Tool Transfer Page'], answer: 'Hyper Text Transfer Protocol' } },
  { id: 66, type: 'spot_diff', category: 'recreational', title: 'Bug Scanner', description: '¡Encuentra la anomalía oculta entre los datos!', difficulty: 'Muy Fácil', points: 80, config: { emoji: '🟢', odd: '🔵', oddPos: 3 } },
  { id: 67, type: 'word_scramble', category: 'recreational', title: 'Crypto Scramble', description: 'Descifra esta palabra desordenada. Pista: Es un tipo de clave.', difficulty: 'Fácil', points: 120, config: { word: 'TOKEN' } },
  { id: 68, type: 'typing_race', category: 'recreational', title: 'Input Rápido', description: 'Teclea "CYBER" con precisión absoluta.', difficulty: 'Fácil', points: 100, config: { word: 'CYBER' } },
  { id: 69, type: 'emoji_pairs', category: 'recreational', title: 'Memoria Dual', description: 'Un nuevo set de pares para memorizar. ¡Más difícil!', difficulty: 'Medio', points: 200, config: { emojis: ['🎮','🕹️','💾','📡','🔐','🌐'] } },
  { id: 70, type: 'trivia', category: 'recreational', title: 'Nerd Check', description: '¿Cuántos bits tiene un byte?', difficulty: 'Muy Fácil', points: 80, config: { question: '¿Cuántos bits tiene un byte?', options: ['4', '8', '16', '32'], answer: '8' } }
];

export const ACHIEVEMENTS = [
  { id: 'first_solve', title: 'Iniciación', description: 'Resuelve tu primer enigma.', icon: 'Zap' },
  { id: 'perfect_memory', title: 'Mente Brillante', description: 'Completa un nivel de memoria sin fallos.', icon: 'Brain' },
  { id: 'hacker_rank', title: 'Hacker de Élite', description: 'Supera el nivel de la terminal.', icon: 'Terminal' },
  { id: 'data_miner', title: 'Arquitecto de Datos', description: 'Acumula 1500 puntos totales.', icon: 'Database' },
  { id: 'speedrunner', title: 'Velocidad de Luz', description: 'Completa un puzle en menos de 5 segundos.', icon: 'Zap' },
  { id: 'god_mode', title: 'Dios de la Red', description: 'Desbloquea todos los protocolos.', icon: 'Cpu' }
];
