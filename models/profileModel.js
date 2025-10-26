const db = require('../db/database');

exports.getAllProfiles = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM profiles', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.updateStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE profiles SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

exports.rotateApiKey = (newKey) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE api SET key = ?', [newKey], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
