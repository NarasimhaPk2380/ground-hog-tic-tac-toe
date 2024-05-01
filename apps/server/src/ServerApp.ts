import express from "express";
import { ExpressLoader } from "./loaders/ExpressLoader";
import logger from "./loaders/logger";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const port = process.env.PORT || 3000;

const clients = {};

export class ServerApp {
  async createServer() {
    const expressApp = await new ExpressLoader(app);
    const httpServer = createServer(expressApp.app);
    const io = new Server(httpServer, {
      cors: {
          origin: "http://localhost:4200", // client address 
      },
    });
    io.on("connection", (socket) => {
      console.log(socket.id);
    
      socket.on('request_clients_online', (data) => {
        io.emit('clients_online',clients);
      });

      socket.on('send_play_request', (data) => {
        clients[data?.fromId] = {...clients[data?.fromId], sent: true, sentTo: data?.toId, urTurn: true, symbol: 'X'};
        clients[data?.toId] = {...clients[data?.toId], gotRequest: true, from: data?.fromId, urTurn: false, accept: false, symbol: 'O'}
        io.emit('clients_online',clients);
      });

      socket.on('send_play_request_accepted', (data) => {
        clients[data?.fromId] = {...clients[data?.fromId],accept: true};
        clients[data?.toId] = {...clients[data?.toId],accept: true}
        io.emit('clients_online',clients);
      });

      socket.on('game_start', (data) => {
        console.log(data);
        if(!clients[data._id]) {
          clients[data._id] = data;
        }
        io.emit('clients_online',clients);
      });
    
      socket.on('game_started', (data) => {
        io.emit('game_board_data',data);
      });

      socket.on('updateTurn', (data) => {
        io.emit('currentTurn',data);
      });

      socket.on('game_result', (data) => {
        io.emit('close_the_game',data);
      });

      socket.on('reset_the_game', (data) => {
        if(clients[data._id]) {
          clients[data._id] = data;
        }
        clients[data?._id] = data;
        io.emit('clients_online',clients);    
      });
    
      socket.on("disconnect", (reason) => {
        io.emit('clients_online',clients);
      });
    });
    logger.info("Server.ts--In createServer - Creating Server.....");
    httpServer.listen(port, () => {
        logger.info(`Server.ts--In createServer - Listening at ${port}`);
      })
      .on("error", (err) => {
        logger.error("Server.ts--In createServer - Failed listening the server")
      }
        
      );
    return expressApp.app;
  }
}
