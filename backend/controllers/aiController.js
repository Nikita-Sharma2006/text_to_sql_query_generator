import { generateMySQLQuery, explainSQLQuery } from '../services/aiService.js';
import { executeMySQLQuery, isMySQLConfigured } from '../config/mysql.js';
import QueryHistory from '../models/QueryHistory.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Generate MySQL query from natural text prompt
 * @route   POST /api/ai/generate
 * @access  Private
 */
export const generateQuery = async (req, res, next) => {
  const { prompt } = req.body;

  try {
    const result = await generateMySQLQuery(req.user._id, prompt);

    // If clarification is required, do NOT save a history log and return question
    if (result.needsClarification) {
      return sendSuccess(res, {
        needsClarification: true,
        question: result.question
      });
    }

    // Save history record in database
    await QueryHistory.create({
      userId: req.user._id,
      prompt,
      generatedSQL: result.sql,
      explanation: result.explanation,
    });

    return sendSuccess(res, {
      needsClarification: false,
      sql: result.sql,
      explanation: result.explanation,
      confidence: result.confidence || 'Medium',
      confidenceReason: result.confidenceReason || 'Context analysis completed.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed explanation for a query
 * @route   POST /api/ai/explain
 * @access  Private
 */
export const explainQuery = async (req, res, next) => {
  const { sql } = req.body;

  try {
    const explanation = await explainSQLQuery(req.user._id, sql);
    return sendSuccess(res, { explanation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Execute generated SQL query on configured database
 * @route   POST /api/ai/execute
 * @access  Private
 */
export const executeQuery = async (req, res, next) => {
  const { sql } = req.body;

  try {
    // 1. Try to run on real MySQL database if configured
    if (isMySQLConfigured()) {
      const startTime = process.hrtime();
      try {
        const { rows } = await executeMySQLQuery(sql);
        const diff = process.hrtime(startTime);
        const executionTimeMs = parseFloat(((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2));

        let columns = [];
        let rowData = [];

        if (Array.isArray(rows)) {
          if (rows.length > 0) {
            columns = Object.keys(rows[0]);
            rowData = rows.map(row => columns.map(col => String(row[col] ?? '')));
          } else {
            columns = ['result'];
            rowData = [['Empty set (0 rows returned)']];
          }
        } else if (rows && typeof rows === 'object' && rows.affectedRows !== undefined) {
          // For INSERT, UPDATE, DELETE statements
          columns = ['affected_rows', 'insert_id', 'warning_status'];
          rowData = [[
            String(rows.affectedRows),
            String(rows.insertId),
            String(rows.warningStatus)
          ]];
        } else {
          columns = ['status'];
          rowData = [['Command executed successfully.']];
        }

        return sendSuccess(res, {
          sql,
          columns,
          rows: rowData,
          executionTimeMs,
          isSimulated: false
        });
      } catch (dbError) {
        return res.status(400).json({
          success: false,
          message: `[MySQL Database Error] ${dbError.message}`
        });
      }
    }

    // 2. Fallback to simulation mode if no database credentials exist
    const sqlLower = (sql || '').toLowerCase();
    let columns = [];
    let rows = [];

    // Analyze SQL string content to render context-specific simulated tables
    if (sqlLower.includes('daimyos') || sqlLower.includes('daimyo')) {
      columns = ['id', 'daimy_name', 'clan_name', 'tribute_amount'];
      rows = [
        ['1', 'Oda Nobunaga', 'Oda', '50000.00'],
        ['2', 'Takeda Shingen', 'Takeda', '45000.00'],
        ['3', 'Toyotomi Hideyoshi', 'Toyotomi', '42000.00'],
        ['4', 'Uesugi Kenshin', 'Uesugi', '38000.00'],
        ['5', 'Tokugawa Ieyasu', 'Tokugawa', '35000.00']
      ];
    } else if (sqlLower.includes('ronin')) {
      columns = ['id', 'name', 'combat_style', 'age', 'status'];
      rows = [
        ['12', 'Miyamoto Musashi', 'Niten Ichi-ryu', '28', 'Active'],
        ['15', 'Sasaki Kojiro', 'Ganryu', '29', 'Active'],
        ['22', 'Araki Mataemon', 'Yagyu Shinkage-ryu', '35', 'Active']
      ];
    } else if (sqlLower.includes('territories') || sqlLower.includes('region')) {
      columns = ['region', 'total_koku'];
      rows = [
        ['Kanto', '150000'],
        ['Kansai', '125000'],
        ['Chubu', '95000'],
        ['Tohoku', '60000']
      ];
    } else {
      // Default statement execution rows
      columns = ['affected_rows', 'status'];
      if (sqlLower.includes('delete')) {
        rows = [['1 row deleted', 'Success']];
      } else if (sqlLower.includes('update')) {
        rows = [['2 rows updated', 'Success']];
      } else if (sqlLower.includes('insert')) {
        rows = [['1 row inserted', 'Success']];
      } else {
        columns = ['status'];
        rows = [['Command executed successfully.']];
      }
    }

    return sendSuccess(res, {
      sql,
      columns,
      rows,
      executionTimeMs: parseFloat((Math.random() * 5 + 1).toFixed(2)),
      isSimulated: true,
      warning: 'MySQL database is not configured. Running dry-run simulation mode.'
    });
  } catch (error) {
    next(error);
  }
};
