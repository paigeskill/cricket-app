import { parseCSV, tokenizeCSVRow } from './csvParserHelper';

describe('tokenizeCSVRow', () => {
  it('should split simple comma-separated values', () => {
    expect(tokenizeCSVRow('NCC,3s,Pontblyddyn')).toEqual(['NCC', '3s', 'Pontblyddyn']);
  });

  it('should preserve commas wrapped inside double quotes', () => {
    expect(tokenizeCSVRow('NCC,3s,"Pontblyddyn, Wales",Home')).toEqual(['NCC', '3s', 'Pontblyddyn, Wales', 'Home']);
  });
});

describe('parseCSV', () => {
  const headers = 'Club,Team,Opponent,Date,Year,Month,H / A,Overs,Maidens,Runs,Wickets,Number,Runs,Dismissal,Out?,Catches,Run Outs,Stumpings,Byes';

  it('should return empty list if empty input', () => {
    expect(parseCSV('')).toEqual([]);
    expect(parseCSV(headers)).toEqual([]);
  });

  it('should correctly parse a standard outfield player row', () => {
    const csvContent = `${headers}\nNCC,3s,Pontblyddyn,5/4/2014,2014,MAY,A,4,3,7,1,8,25,CWK,1,1,0,N/A,N/A`;
    const results = parseCSV(csvContent);

    expect(results).toHaveLength(1);
    const game = results[0];
    expect(game.club).toBe('NCC');
    expect(game.team).toBe('3s');
    expect(game.opponent).toBe('Pontblyddyn');
    expect(game.date).toBe('2014-05-04'); // Parsed MM/DD/YYYY
    expect(game.location).toBe('Away');
    expect(game.did_not_bat).toBe(false);
    expect(game.runs_scored).toBe(25);
    expect(game.batting_number).toBe(8);
    expect(game.dismissal).toBe('Caught by Wicketkeeper'); // CWK acronym mapped
    expect(game.is_out).toBe(true);
    expect(game.overs_bowled).toBe(4);
    expect(game.maidens_bowled).toBe(3);
    expect(game.runs_conceded).toBe(7); // Bowling runs is column index 9
    expect(game.wickets_taken).toBe(1);
    expect(game.is_keeper).toBe(false); // Stumpings & Byes are N/A
    expect(game.catches).toBe(1); // Standard catches
    expect(game.run_outs).toBe(0);
    expect(game.catches_keeper).toBe(0);
    expect(game.run_outs_keeper).toBe(0);
    expect(game.stumpings).toBe(0);
    expect(game.byes_conceded).toBe(0);
  });

  it('should correctly parse a wicketkeeper match row with stumping/bye integers', () => {
    const csvContent = `${headers}\nNCC,3s,Pontblyddyn,5/4/2014,2014,MAY,H,N/A,N/A,N/A,N/A,3,50,NO,0,2,1,1,3`;
    const results = parseCSV(csvContent);

    expect(results).toHaveLength(1);
    const game = results[0];
    expect(game.date).toBe('2014-05-04');
    expect(game.location).toBe('Home');
    expect(game.did_not_bat).toBe(false);
    expect(game.runs_scored).toBe(50);
    expect(game.batting_number).toBe(3);
    expect(game.dismissal).toBe('Not Out'); // NO acronym mapped
    expect(game.is_out).toBe(false);
    expect(game.overs_bowled).toBeNull();
    expect(game.maidens_bowled).toBeNull();
    expect(game.runs_conceded).toBeNull();
    expect(game.wickets_taken).toBeNull();
    expect(game.is_keeper).toBe(true); // Stumpings & Byes are integers (not N/A)
    expect(game.catches_keeper).toBe(2); // Catches assigned to keeper
    expect(game.run_outs_keeper).toBe(1); // Run outs assigned to keeper
    expect(game.stumpings).toBe(1);
    expect(game.byes_conceded).toBe(3);
    expect(game.catches).toBe(0);
    expect(game.run_outs).toBe(0);
  });

  it('should set did_not_bat to true if batting runs is N/A', () => {
    const csvContent = `${headers}\nNCC,3s,Pontblyddyn,5/4/2014,2014,MAY,H,4,0,15,2,N/A,N/A,N/A,0,0,0,N/A,N/A`;
    const results = parseCSV(csvContent);

    expect(results).toHaveLength(1);
    const game = results[0];
    expect(game.did_not_bat).toBe(true);
    expect(game.runs_scored).toBeNull();
    expect(game.batting_number).toBeNull();
    expect(game.dismissal).toBe('DNB');
    expect(game.is_out).toBe(false);
  });
});
