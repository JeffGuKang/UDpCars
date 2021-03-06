"use strict";

const {expect} = require("chai");
const {createSocket} = require("dgram");
const {createListener} = require("../lib/listener");

describe("listener module", function() {
  describe("socket state", function() {
    let listener, properties = {};

    beforeEach(function(done) {
      listener = createListener();
      listener.start(done);
    });

    it("should be in 'BOUND' state (2)", function() {
      expect(listener.socket).to.have.property("_bindState", 2);
    });

    it("should have a correct address (0.0.0.0)", function() {
      properties = listener.socket.address();
      expect(properties).have.property("address", "0.0.0.0");
    });

    it("should have been bound to port 5606", function() {
      properties = listener.socket.address();
    });

    afterEach(function(done) {
      listener.stop(done);
      listener, properties = {};
    });
  });

  describe("message events", function() {
    let client = createSocket("udp4");
    let listener = {};
    const testMessage = "This is a valid message";

    before(function(done) {
      listener = createListener();

      listener.start(function() {
        listener.socket.on("message", function(clientMsg, clientHost) {
          listener.messageQueue.push(clientMsg.toString());
        });

        client.send(testMessage, 5606, "localhost", function() {
          client.close(done);
        });
      });
    });

    it("should receive a message", function() {
      expect(listener).to.have.property("messageQueue").with.length(1);
    });

    after(function(done) {
      listener.stop(done);
      listener = {};
    });
  });

  describe("socket teardown", function() {
    let listener = {};

    before(function(done) {
      listener = createListener();
      listener.start(function() {
        listener.stop(done);
      });
    });

    it("should have a 'null' handle", function() {
      expect(listener.socket).to.have.property("_handle", null);
    });
  });
});
