export const simulationTemplates: Record<string, any> = {
  ss101: {
    simulationType: "EXPLORATION",
    scenario: "Terminal de Gasoductos Sempra",
    imageUrl: "/simulations/industrial_safety_1.png",
    timeLimitSeconds: 120,
    hotspots: [
      {
        id: "h1",
        type: "OIL_SPILL",
        riskType: "Derrame de Aceite",
        name: "Derrame de Aceite",
        x: 25,
        y: 80,
        radius: 10,
        penaltyPoints: 25,
        justification: "Los derrames en el piso son una de las causas más frecuentes de accidentes por resbalones y caídas. Además, representan un riesgo grave de incendio o contaminación."
      },
      {
        id: "h2",
        type: "NO_PPE",
        riskType: "Falta de EPP (Casco)",
        name: "Falta de EPP (Casco)",
        x: 37,
        y: 46,
        radius: 8,
        penaltyPoints: 25,
        justification: "El uso de Equipo de Protección Personal (EPP) es mandatorio en áreas operativas. La ausencia de casco expone al trabajador a traumatismos craneoencefálicos por caída de herramientas o materiales."
      },
      {
        id: "h3",
        type: "EXPOSED_CABLES",
        riskType: "Cables Expuestos",
        name: "Cables Expuestos",
        x: 80,
        y: 55,
        radius: 12,
        penaltyPoints: 25,
        justification: "El cableado eléctrico expuesto fuera de su canalización o panel cerrado crea un riesgo inminente de electrocución, cortocircuito y posibles arcos eléctricos que pueden desencadenar incendios."
      },
      {
        id: "h4",
        type: "LOOSE_CABLES",
        riskType: "Cables Sueltos",
        name: "Cables Sueltos",
        x: 74,
        y: 65,
        radius: 10,
        penaltyPoints: 25,
        justification: "Los cables sueltos colgando o tirados en el suelo representan un riesgo grave de tropiezo y caída, además de peligro eléctrico si llegan a entrar en contacto con agua o maquinaria."
      }
    ]
  },
  ss104: {
    simulationType: "GUIDED_SEQUENCE",
    scenario: "Subestación de Control de Motores (MCC)",
    imageUrl: "/simulations/electrical_safety_1.png",
    timeLimitSeconds: 180,
    hotspots: [
      {
        id: "h1",
        type: "SWITCH",
        riskType: "Libranza Eléctrica",
        name: "Interruptor Principal 480V",
        x: 10.0,
        y: 15.0,
        width: 20.0,
        height: 55.0,
        stepOrder: 1,
        instruction: "Encuentra e interactúa con el interruptor principal de alimentación de la subestación para realizar la desconexión segura (Libranza).",
        quiz: {
          question: "Al realizar la desconexión de un interruptor de fuerza bajo carga para mantenimiento, ¿cuál es la medida preventiva de seguridad inmediata?",
          options: [
            { id: "o1", text: "Abrir directamente la puerta del gabinete sin usar protección especial.", feedback: "¡Inseguro! Abrir la puerta bajo carga sin protección ante un potencial arco eléctrico viola la NOM-029 y la NFPA 70E." },
            { id: "o2", text: "Posicionarse a un costado del tablero (fuera de la línea de fuego ante posible arco eléctrico), usar careta facial Arc Flash y girar la manija de operación a la posición OFF.", isCorrect: true },
            { id: "o3", text: "Cortar los cables alimentadores con pinzas comunes dieléctricas.", feedback: "¡Peligro mortal! Cortar cables vivos sin verificar ausencia de tensión ni realizar libranza puede provocar un arco eléctrico letal." }
          ]
        },
        justification: "La NOM-029-STPS-2011 exige realizar la libranza (corte de energía) antes de intervenir. Se debe operar de costado para evitar el impacto directo en el rostro en caso de un arco eléctrico (Arc Flash) inesperado."
      },
      {
        id: "h2",
        type: "LOTO_LOCK",
        riskType: "Bloqueo y Candadeo (LOTO)",
        name: "Dispositivo de Bloqueo LOTO",
        x: 32.0,
        y: 20.0,
        width: 18.0,
        height: 45.0,
        stepOrder: 2,
        instruction: "Aplica el bloqueo físico y etiquetado (LOTO) en la manija del interruptor principal desenergizado.",
        quiz: {
          question: "Según la NOM-029-STPS-2011, ¿quién debe conservar la llave única del candado de bloqueo instalado en el disyuntor?",
          options: [
            { id: "o1", text: "El supervisor del centro de trabajo para emergencias.", feedback: "Incorrecto. Si el supervisor tiene la llave, podría energizar el circuito por error mientras el trabajador sigue interviniendo." },
            { id: "o2", text: "El encargado general de la subestación.", feedback: "Incorrecto. Ningún tercero debe poseer control de la llave de tu candado de seguridad." },
            { id: "o3", text: "Estrictamente el trabajador autorizado que realiza la actividad de mantenimiento.", isCorrect: true }
          ]
        },
        justification: "El candado LOTO debe ser personal y la llave retenida exclusivamente por el trabajador para evitar que terceros energicen el circuito por accidente mientras se realiza el trabajo."
      },
      {
        id: "h3",
        type: "MEASURE",
        riskType: "Verificación de Ausencia de Tensión",
        name: "Bornes de Medición",
        x: 52.0,
        y: 15.0,
        width: 22.0,
        height: 55.0,
        stepOrder: 3,
        instruction: "Realiza la comprobación de ausencia de tensión en los bornes del circuito para garantizar energía cero.",
        quiz: {
          question: "Antes de tocar los conductores con las manos, ¿cómo se debe validar el instrumento de medición (multímetro) para verificar la ausencia de tensión?",
          options: [
            { id: "o1", text: "Encenderlo y verificar que la pantalla no muestre mensaje de batería baja.", feedback: "Insuficiente. La pantalla encendida no asegura que las puntas de prueba o los fusibles internos del multímetro estén operando correctamente." },
            { id: "o2", text: "Probar el instrumento en una fuente de tensión viva conocida antes y después de la medición (método de tres pasos).", isCorrect: true },
            { id: "o3", text: "Frotar las puntas de prueba para ver si genera chispa.", feedback: "¡Sumamente peligroso! Provocar cortocircuitos deliberados puede dañar el equipo y causar lesiones." }
          ]
        },
        justification: "El método de tres pasos asegura que el multímetro funcione correctamente antes y después de medir, previniendo falsos negativos (lecturas de 0V en cables energizados por falla de fusible o cable del medidor)."
      },
      {
        id: "h4",
        type: "BOUNDARY",
        riskType: "Delimitación de Seguridad",
        name: "Perímetro Arc Flash Boundary",
        x: 75.0,
        y: 50.0,
        width: 23.0,
        height: 45.0,
        stepOrder: 4,
        instruction: "Coloca las delimitaciones de seguridad para restringir el paso de personal no calificado al área de aproximación.",
        quiz: {
          question: "Según la NFPA 70E, ¿cuál es el límite de aproximación que solo puede ser cruzado por personas calificadas equipadas con el EPP de arco eléctrico adecuado?",
          options: [
            { id: "o1", text: "Límite de Aproximación Restringida (Restricted Approach Boundary).", isCorrect: true },
            { id: "o2", text: "Límite de Aproximación Limitada (Limited Approach Boundary).", feedback: "Incorrecto. El límite de aproximación limitada es la distancia más lejana para evitar choque eléctrico, no es el límite crítico de Arc Flash." },
            { id: "o3", text: "Límite de Aproximación Permitida.", feedback: "Incorrecto. Este concepto no está normado bajo la NFPA 70E." }
          ]
        },
        justification: "El límite de aproximación restringida está más cerca de las partes vivas expuestas y requiere EPP calificado contra arco eléctrico y choque. Ninguna persona no calificada puede traspasarlo sin supervisión y EPP completo."
      }
    ]
  },
  tec102: {
    simulationType: "GUIDED_SEQUENCE",
    scenario: "Estación de Distribución de Gas Natural - Bombas de Condensados",
    imageUrl: "/simulations/centrifugal_pump_1.png",
    timeLimitSeconds: 240,
    hotspots: [
      {
        id: "p1",
        type: "INSPECT",
        riskType: "Nivel de Lubricante y Sellos",
        name: "Cárter de Rodamientos y Visor de Aceite",
        x: 8.0,
        y: 20.0,
        width: 18.0,
        height: 40.0,
        stepOrder: 1,
        instruction: "Verifica el nivel de aceite en el cárter de rodamientos de la bomba usando el visor transparente para asegurar una lubricación adecuada antes del arranque.",
        quiz: {
          question: "¿Qué indicador visual garantiza la correcta lubricación de los rodamientos antes de encender la bomba centrífuga?",
          options: [
            { id: "o1", text: "Que el cárter de rodamientos esté lleno hasta el tope de aceite.", feedback: "¡Error! Llenar en exceso el cárter provoca sobrecalentamiento de los rodamientos debido al batido violento del aceite, provocando fallas prematuras." },
            { id: "o2", text: "El nivel de aceite ubicado exactamente en el centro del visor transparente (ojo de buey) del cárter.", isCorrect: true },
            { id: "o3", text: "Que no gotee líquido del cárter, sin importar lo que muestre el visor.", feedback: "Incorrecto. La ausencia de fugas externas visibles no garantiza que el cárter cuente con el volumen de aceite necesario para la operación." }
          ]
        },
        justification: "La norma API 610 indica que el nivel de lubricante debe mantenerse en el punto medio del visor. Un nivel bajo causará fricción extrema y fallas catastróficas, mientras que un nivel excesivo causará sobrecalentamiento."
      },
      {
        id: "p2",
        type: "VENT",
        riskType: "Cebado y Venteo de Aire/Gas",
        name: "Válvula de Purga de la Carcasa",
        x: 30.0,
        y: 15.0,
        width: 18.0,
        height: 35.0,
        stepOrder: 2,
        instruction: "Interactúa con la válvula de purga/venteo en la parte superior de la carcasa para eliminar bolsas de aire o gas acumuladas y cebar la bomba.",
        quiz: {
          question: "Al cebar una bomba centrífuga en una estación de gas, ¿por qué es crítico ventear completamente el aire o vapor de la carcasa antes del arranque?",
          options: [
            { id: "o1", text: "Para evitar la cavitación por aire o que la bomba trabaje en seco, lo cual destruiría las caras del sello mecánico en segundos.", isCorrect: true },
            { id: "o2", text: "Para presurizar la línea de succión y calentar el fluido.", feedback: "Incorrecto. El venteo se realiza para desalojar gases acumulados que impiden el cebado, no tiene como fin presurizar ni alterar la temperatura de la succión." },
            { id: "o3", text: "Para forzar al impulsor a girar en la dirección correcta por presión de aire.", feedback: "¡Peligro! El sentido de rotación es puramente eléctrico. Arrancar una bomba centrífuga sin líquido en su interior dañará gravemente el equipo." }
          ]
        },
        justification: "NOM-004-STPS-1999 y las buenas prácticas operativas exigen el cebado completo. Las bombas centrífugas no están diseñadas para bombear gases; el aire atrapado provoca la pérdida inmediata de succión y sobrecalentamiento del sello mecánico."
      },
      {
        id: "p3",
        type: "VALVE",
        riskType: "Alineación de Válvulas de Proceso",
        name: "Válvulas de Succión y Descarga",
        x: 52.0,
        y: 25.0,
        width: 20.0,
        height: 50.0,
        stepOrder: 3,
        instruction: "Verifica el estado de las válvulas de proceso: abre la válvula de succión al 100% y mantén la válvula de descarga estrangulada o cerrada para el arranque.",
        quiz: {
          question: "¿Cuál es la configuración correcta de las válvulas de proceso para el arranque de una bomba centrífuga estándar?",
          options: [
            { id: "o1", text: "Válvula de succión cerrada y descarga abierta al 100%.", feedback: "¡Peligro crítico! Arrancar la bomba con la succión cerrada provocará cavitación instantánea, daño al impulsor y destrucción del sello mecánico por falta de lubricación." },
            { id: "o2", text: "Válvula de succión abierta al 100% y válvula de descarga cerrada (o estrangulada al mínimo) para reducir la carga de arranque del motor.", isCorrect: true },
            { id: "o3", text: "Ambas válvulas (succión y descarga) abiertas al 100% desde el inicio.", feedback: "Inadecuado. Arrancar con la descarga totalmente abierta exige el torque máximo del motor desde el segundo cero, lo que puede disparar las protecciones por sobrecorriente." }
          ]
        },
        justification: "El torque y la corriente de arranque (inrush) del motor eléctrico se reducen al mínimo cuando la descarga está cerrada (flujo cero), protegiendo la integridad del devanado del motor en base a especificaciones de diseño."
      },
      {
        id: "p4",
        type: "MONITOR",
        riskType: "Monitoreo de Presión de Descarga",
        name: "Manómetro de Descarga",
        x: 76.0,
        y: 15.0,
        width: 18.0,
        height: 40.0,
        stepOrder: 4,
        instruction: "Una vez arrancada la bomba, monitorea el manómetro de descarga para confirmar la correcta entrega de presión diferencial del equipo.",
        quiz: {
          question: "Inmediatamente después del arranque del motor, ¿qué comportamiento en el manómetro de descarga indica una operación exitosa?",
          options: [
            { id: "o1", text: "El incremento de la presión diferencial que se estabilice en el valor nominal del diseño sin fluctuaciones.", isCorrect: true },
            { id: "o2", text: "La caída de presión a cero absoluto, lo que demuestra flujo libre continuo.", feedback: "¡Grave! Una caída de presión a cero posterior al arranque indica pérdida de cebado, giro inverso del motor o rotura interna del eje." },
            { id: "o3", text: "Que la aguja del manómetro vibre violentamente hasta el límite de escala.", feedback: "Incorrecto. Una vibración violenta u oscilación en la aguja es síntoma inequívoco de cavitación o recirculación severa en el impulsor." }
          ]
        },
        justification: "La presión diferencial (Descarga menos Succión) confirma que el impulsor está transmitiendo energía cinética al fluido de manera estable, de acuerdo a la curva de operación de la bomba centrífuga."
      }
    ]
  }
};
