// src/lib/db.js
import { sql } from '@vercel/postgres';

export async function checkUsername(username) {
  try {
    const { rows } = await sql`
      SELECT username FROM rooms WHERE username = ${username}
    `;
    return { isAvailable: rows.length === 0 };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to check username availability');
  }
}

export async function createRoom({ username, roomName, theme, adminEmail, invitedEmails }) {
  try {
    // Start a transaction
    await sql`BEGIN`;

    // Create the room
    const { rows: [room] } = await sql`
      INSERT INTO rooms (username, room_name, theme, admin_email)
      VALUES (${username}, ${roomName}, ${theme}, ${adminEmail})
      RETURNING id
    `;

    // Add invited members
    if (invitedEmails && invitedEmails.length > 0) {
      await Promise.all(invitedEmails.map(email => 
        sql`
          INSERT INTO room_members (room_id, email)
          VALUES (${room.id}, ${email})
        `
      ));
    }

    await sql`COMMIT`;
    return room;
  } catch (error) {
    await sql`ROLLBACK`;
    console.error('Database error:', error);
    throw new Error('Failed to create room');
  }
}

export async function getRoomByUsername(username) {
  try {
    const { rows: [room] } = await sql`
      SELECT r.*, 
             array_agg(DISTINCT rm.email) as invited_members
      FROM rooms r
      LEFT JOIN room_members rm ON r.id = rm.room_id
      WHERE r.username = ${username}
      GROUP BY r.id
    `;
    return room;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch room');
  }
}

export async function getNotes(roomId) {
  try {
    const { rows } = await sql`
      SELECT * FROM notes 
      WHERE room_id = ${roomId}
      ORDER BY created_at ASC
    `;
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch notes');
  }
}

export async function createNote({ roomId, content, positionX, positionY, authorEmail }) {
  try {
    const { rows: [note] } = await sql`
      INSERT INTO notes (room_id, content, position_x, position_y, author_email)
      VALUES (${roomId}, ${content}, ${positionX}, ${positionY}, ${authorEmail})
      RETURNING *
    `;
    return note;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create note');
  }
}

export async function updateNote({ noteId, content }) {
  try {
    const { rows: [note] } = await sql`
      UPDATE notes 
      SET content = ${content}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${noteId}
      RETURNING *
    `;
    return note;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update note');
  }
}

export async function deleteNote(noteId) {
  try {
    await sql`DELETE FROM notes WHERE id = ${noteId}`;
    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete note');
  }
}

export async function checkRoomAccess(username, userEmail) {
  try {
    const { rows: [access] } = await sql`
      SELECT CASE 
        WHEN r.admin_email = ${userEmail} THEN true
        WHEN rm.email = ${userEmail} THEN true
        ELSE false
      END as has_access
      FROM rooms r
      LEFT JOIN room_members rm ON r.id = rm.room_id
      WHERE r.username = ${username}
    `;
    return access?.has_access || false;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to check room access');
  }
}