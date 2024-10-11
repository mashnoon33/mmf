export type BoardState = string[][];
export type HintState = number[][];
export type Status = 'playing' | 'won' | 'lost';

export function obfuscateBoardState(boardState: BoardState) {
    const obfuscatedBoardState = boardState.map((row: string[]) => {
      return row.map((cell: string) => {
        return "x"
      });
    });
  
    return obfuscatedBoardState;
  }
  
  export function generateHints(secretCode: string[], guess: BoardState): number[] {
    const hint: number[] = [];
    const incorrectGuesses: string[] = [];
    const unmatchedSolutions: string[] = [];
  
    for (let i = 0; i < secretCode.length; i++) {
      if (secretCode[i] === guess[i]) {
        hint.push(1);
      } else {
        //@ts-expect-error unknown error
        incorrectGuesses.push(guess[i]);
        //@ts-expect-error unknown error
        unmatchedSolutions.push(secretCode[i]);
      }
    }
  
    for (const g_c of incorrectGuesses) {
      if (unmatchedSolutions.includes(g_c)) {
        hint.push(0);
        unmatchedSolutions.splice(unmatchedSolutions.indexOf(g_c), 1);
      }
    }
  
    while (hint.length < 4) {
      hint.push(-1);
    }
  
    return hint.slice(0, 4);
  }