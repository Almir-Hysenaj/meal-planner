import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runRecommendation(userId, meals) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, '../ml/venv/Scripts/python.exe');

    const scriptPath = path.join(__dirname, '../ml/recommend.py');

    const python = spawn(pythonPath, [scriptPath, userId]);

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.log(error);

        reject(new Error(error));

        return;
      }

      try {
        resolve(JSON.parse(output));
      } catch (err) {
        reject(err);
      }
    });

    // Send meals through stdin
    python.stdin.on('error', (err) => {
      reject(err);
    });

    python.stdin.write(JSON.stringify(meals));

    python.stdin.end();
  });
}
