'use client';

import { useState } from 'react';
import { ahorroMensual, parametrosDe, redondearMultiplo, TASA_INTERESES_CESANTIAS } from '@/lib/calculos';
import { pesos } from '@/lib/formato';
import { miles, soloEnteros } from '../lib/entradas';
import { VistaP03b1 } from './VistaP03b1';

const P = parametrosDe(2026);
const ON = 'min-height: 44px; border: 0; border-radius: 9px; background: #FFFFFF; color: #0F372D; font-weight:700;font-size:15px;line-height:1.2;font-family:inherit; padding: 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(15,55,45,0.15)';
const OFF = 'min-height: 44px; border: 0; border-radius: 9px; background: transparent; color: #4A6158; font-weight:600;font-size:15px;line-height:1.2;font-family:inherit; padding: 8px; cursor: pointer';

/** P03: cesantías con contrato laboral (días/360 e intereses del 12%) o como independiente (apartar 1/12 de cada pago). */
export function CalculadoraCesantias() {
  const [modo, setModo] = useState<'laboral' | 'independiente'>('laboral');
  const [salario, setSalario] = useState(3_000_000);
  const [dias, setDias] = useState(360);
  const [ingreso, setIngreso] = useState(8_000_000);

  const lab = modo === 'laboral';
  const d = Math.min(Math.max(dias || 0, 0), 360);
  const cesantias = (salario * d) / 360;
  const intereses = (cesantias * d * TASA_INTERESES_CESANTIAS) / 360;
  const mes = redondearMultiplo(ahorroMensual(ingreso).cesantias, P.redondeoPila);

  return (
    <VistaP03b1
      cta={lab ? '¿Trabajas también por tu cuenta? Prueba Frilo' : 'Lleva tus cesantías en Frilo'}
      ctaHref="#registro"
      dias={String(dias)}
      eInd={lab ? OFF : ON}
      eLab={lab ? ON : OFF}
      esInd={!lab}
      esLab={lab}
      ingresoTxt={miles(ingreso)}
      l1={lab ? 'Tus cesantías' : 'Aparta cada mes para tus cesantías'}
      l2={lab ? 'Intereses de cesantías (12%)' : 'En 12 meses tendrías'}
      nota={lab ? 'Las cesantías van a tu fondo; los intereses te los paga directamente el empleador.' : 'Más los intereses que te pague la cuenta donde las guardes.'}
      onDias={(e) => setDias(soloEnteros(e))}
      onIngreso={(e) => setIngreso(soloEnteros(e))}
      onSalario={(e) => setSalario(soloEnteros(e))}
      pInd={lab ? 'false' : 'true'}
      pLab={lab ? 'true' : 'false'}
      salarioTxt={miles(salario)}
      setInd={() => setModo('independiente')}
      setLab={() => setModo('laboral')}
      v1={lab ? pesos(cesantias) : pesos(mes)}
      v2={lab ? pesos(intereses) : pesos(mes * 12)}
    />
  );
}
