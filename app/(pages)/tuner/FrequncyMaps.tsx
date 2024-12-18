export type NoteRecord = {freq: number, note: string}

const noteFrequencies = [
    { freq: 32.70, note: "C" },
    { freq: 34.65, note: "C&#9839; / D&#9837;" },
    { freq: 36.71, note: "D" },
    { freq: 38.89, note: "D&#9839; / E&#9837;" },
    { freq: 41.20, note: "E" },
    { freq: 43.65, note: "F" },
    { freq: 46.25, note: "F&#9839; / G&#9837;" },
    { freq: 49.00, note: "G" },
    { freq: 51.91, note: "G&#9839; / A&#9837;" },
    { freq: 55.00, note: "A" },
    { freq: 58.27, note: "A&#9839; / B&#9837;" },
    { freq: 61.74, note: "B" },
    { freq: 65.41, note: "C" },
    { freq: 69.30, note: "C&#9839; / D&#9837;" },
    { freq: 73.42, note: "D" },
    { freq: 77.78, note: "D&#9839; / E&#9837;" },
    { freq: 82.41, note: "E" },
    { freq: 87.31, note: "F" },
    { freq: 92.50, note: "F&#9839; / G&#9837;" },
    { freq: 98.00, note: "G" },
    { freq: 103.83, note: "G&#9839; / A&#9837;" },
    { freq: 110.00, note: "A" },
    { freq: 116.54, note: "A&#9839; / B&#9837;" },
    { freq: 123.47, note: "B" },
    { freq: 130.81, note: "C" },
    { freq: 138.59, note: "C&#9839; / D&#9837;" },
    { freq: 146.83, note: "D" },
    { freq: 155.56, note: "D&#9839; / E&#9837;" },
    { freq: 164.81, note: "E" },
    { freq: 174.61, note: "F" },
    { freq: 185.00, note: "F&#9839; / G&#9837;" },
    { freq: 196.00, note: "G" },
    { freq: 207.65, note: "G&#9839; / A&#9837;" },
    { freq: 220.00, note: "A" },
    { freq: 233.08, note: "A&#9839; / B&#9837;" },
    { freq: 246.94, note: "B" },
    { freq: 261.63, note: "C" },
    { freq: 277.18, note: "C&#9839; / D&#9837;" },
    { freq: 293.66, note: "D" },
    { freq: 311.13, note: "D&#9839; / E&#9837;" },
    { freq: 329.63, note: "E" },
    { freq: 349.23, note: "F" },
    { freq: 369.99, note: "F&#9839; / G&#9837;" },
    { freq: 392.00, note: "G" },
    { freq: 415.30, note: "G&#9839; / A&#9837;" },
    { freq: 440.00, note: "A" },
    { freq: 466.16, note: "A&#9839; / B&#9837;" },
    { freq: 493.88, note: "B" },
    { freq: 523.25, note: "C" },
    { freq: 554.37, note: "C&#9839; / D&#9837;" },
    { freq: 587.33, note: "D" },
    { freq: 622.25, note: "D&#9839; / E&#9837;" },
    { freq: 659.26, note: "E" },
    { freq: 698.46, note: "F" },
    { freq: 739.99, note: "F&#9839; / G&#9837;" },
    { freq: 783.99, note: "G" },
    { freq: 830.61, note: "G&#9839; / A&#9837;" },
    { freq: 880.00, note: "A" },
    { freq: 932.33, note: "A&#9839; / B&#9837;" },
    { freq: 987.77, note: "B" },
    { freq: 1046.50, note: "C" },
    { freq: 1108.73, note: "C&#9839; / D&#9837;" },
    { freq: 1174.66, note: "D" },
    { freq: 1244.51, note: "D&#9839; / E&#9837;" },
    { freq: 1318.51, note: "E" },
    { freq: 1396.91, note: "F" },
    { freq: 1480.00, note: "F&#9839; / G&#9837;" },
    { freq: 1567.98, note: "G" },
    { freq: 1661.22, note: "G&#9839; / A&#9837;" },
    { freq: 1760.00, note: "A" },
    { freq: 1864.66, note: "A&#9839; / B&#9837;" },
    { freq: 1975.53, note: "B" },
    { freq: 2093.00, note: "C" },
    { freq: 2217.46, note: "C&#9839; / D&#9837;" },
    { freq: 2349.32, note: "D" },
    { freq: 2489.02, note: "D&#9839; / E&#9837;" },
    { freq: 2637.02, note: "E" },
    { freq: 2793.83, note: "F" },
    { freq: 2960.00, note: "F&#9839; / G&#9837;" },
    { freq: 3135.96, note: "G" },
    { freq: 3322.44, note: "G&#9839; / A&#9837;" },
    { freq: 3520.00, note: "A" },
    { freq: 3729.31, note: "A&#9839; / B&#9837;" },
    { freq: 3951.07, note: "B" },
    { freq: 4186.01, note: "C" },
    { freq: 4434.92, note: "C&#9839; / D&#9837;" },
    { freq: 4698.63, note: "D" },
    { freq: 4978.03, note: "D&#9839; / E&#9837;" },
    { freq: 5274.04, note: "E" },
    { freq: 5587.65, note: "F" },
    { freq: 5919.91, note: "F&#9839; / G&#9837;" },
    { freq: 6271.93, note: "G" },
    { freq: 6644.88, note: "G&#9839; / A&#9837;" },
    { freq: 7040.00, note: "A" },
    { freq: 7458.62, note: "A&#9839; / B&#9837;" },
    { freq: 7902.13, note: "B" },
    { freq: 8372.02, note: "C" },
    { freq: 8869.84, note: "C&#9839; / D&#9837;" },
    { freq: 9397.27, note: "D" },
    { freq: 9956.06, note: "D&#9839; / E&#9837;" },
    { freq: 10548.08, note: "E" },
    { freq: 11175.30, note: "F" },
    { freq: 11839.82, note: "F&#9839; / G&#9837;" },
    { freq: 12543.85, note: "G" },
    { freq: 13289.75, note: "G&#9839; / A&#9837;" },
    { freq: 14080.00, note: "A" },
    { freq: 14917.24, note: "A&#9839; / B&#9837;" },
    { freq: 15804.26, note: "B" }
  ];
  
  
  function getClosestNoteIndex(f: number): number {
    const upperIndex = noteFrequencies.findIndex(note => note.freq >= f);
    const lowerIndex = upperIndex - 1;
    const upperDelta = noteFrequencies[upperIndex].freq - f;
    const lowerDelta = f - noteFrequencies[lowerIndex].freq;
    if (Math.min(upperDelta, lowerDelta) == upperDelta) {
        return upperIndex;
    } else {
        return lowerIndex;
    }
  }

  function calculateCentsFromTarget(f: number, target: NoteRecord, lower: NoteRecord, upper: NoteRecord) {
    const distance = target.freq > f ? upper.freq - target.freq : target.freq - lower.freq;
    return Math.round(((f - target.freq) / distance) * 100)
  }

  export function frequencyToPitch(f: number): {target: NoteRecord, below: NoteRecord, above: NoteRecord, cents: number} {
    const targetIndex = getClosestNoteIndex(f);
    const target = noteFrequencies[targetIndex];
    const lower = noteFrequencies[targetIndex - 1];
    const upper = noteFrequencies[targetIndex + 1];
    let cents = calculateCentsFromTarget(f, target, lower, upper);
    cents = Math.round(cents / 3) * 3; // Round to nearest 3 cents
    return {target: target, below: lower, above: upper, cents: cents}

  }
  
  // ChatGPT provided function to implement YIN Algorithm for pitch detection
  export function yin(buffer: Float32Array, sampleRate: number) {
          
          const threshold = 0.3; // Determines confidence level
          const yinBuffer = new Float32Array(buffer.length / 2);
        
          for (let tau = 0; tau < yinBuffer.length; tau++) {
            yinBuffer[tau] = 0;
            for (let i = 0; i < yinBuffer.length; i++) {
              const delta = buffer[i] - buffer[i + tau];
              yinBuffer[tau] += delta * delta;
            }
          }
        
          yinBuffer[0] = 1;
          let runningSum = 0;
          for (let tau = 1; tau < yinBuffer.length; tau++) {
            runningSum += yinBuffer[tau];
            yinBuffer[tau] *= tau / runningSum;
          }
        
          let tau = -1;
          for (let i = 1; i < yinBuffer.length; i++) {
            if (yinBuffer[i] < threshold) {
              tau = i;
              while (i + 1 < yinBuffer.length && yinBuffer[i + 1] < yinBuffer[i]) {
                i++;
                tau = i;
              }
              break;
            }
          }
        
          if (tau === -1 || tau === 0) return null;
          const betterTau = tau + (yinBuffer[tau - 1] - yinBuffer[tau + 1]) /
            (2 * (yinBuffer[tau - 1] - 2 * yinBuffer[tau] + yinBuffer[tau + 1]));
        
          const frequency = sampleRate / betterTau;
          return frequency;
        }