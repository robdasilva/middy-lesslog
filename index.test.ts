import middy from "@middy/core";
import lesslog from "lesslog";
import log from "./index.ts";

jest.mock("lesslog");

describe("log", () => {
  describe("after", () => {
    it("logs response", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");
      const response = Symbol("response");

      expect(
        log().after({ context, event, response } as unknown as middy.Request),
      ).toBeUndefined();

      expect(lesslog.debug).toHaveBeenCalledTimes(1);
      expect(lesslog.debug).toHaveBeenCalledWith("Response", { response });

      expect(lesslog.clear).toHaveBeenCalledTimes(1);
      expect(lesslog.clear).toHaveBeenCalledWith();

      expect(lesslog.label).toBe("");
    });

    it("logs error if set", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");
      const response = Symbol("response");
      const details = Symbol("details");

      const error = Object.assign(new Error("‾\\_(ツ)_/‾"), { details });

      expect(
        log().after({
          context,
          error,
          event,
          response,
        } as unknown as middy.Request),
      ).toBeUndefined();

      expect(lesslog.debug).toHaveBeenCalledTimes(1);
      expect(lesslog.debug).toHaveBeenCalledWith("Response", { response });

      expect(lesslog.error).toHaveBeenCalledTimes(1);
      expect(lesslog.error).toHaveBeenCalledWith(error.message, {
        error: { details, message: error.message, stack: error.stack },
      });

      expect(lesslog.clear).not.toHaveBeenCalled();

      expect(lesslog.label).toBe("");
    });
  });

  describe("before", () => {
    it("logs event", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");

      expect(
        log().before({ context, event } as unknown as middy.Request),
      ).toBeUndefined();

      expect(lesslog.debug).toHaveBeenCalledTimes(1);
      expect(lesslog.debug).toHaveBeenCalledWith("Request", { context, event });

      expect(lesslog.label).toBe(context.awsRequestId);
    });
  });

  describe("onError", () => {
    it("logs error", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");
      const details = Symbol("details");

      const error = Object.assign(new Error("‾\\_(ツ)_/‾"), { details });

      expect(
        log().onError({ context, error, event } as unknown as middy.Request),
      ).toBeUndefined();

      expect(lesslog.error).toHaveBeenCalledTimes(1);
      expect(lesslog.error).toHaveBeenCalledWith(error.message, {
        error: { details, message: error.message, stack: error.stack },
      });

      expect(lesslog.label).toBe("");
    });

    it("does nothing if no error", () => {
      const context = Symbol("context");
      const event = Symbol("event");

      expect(
        log().onError({ context, event } as unknown as middy.Request),
      ).toBeUndefined();

      expect(lesslog.error).not.toHaveBeenCalled();
    });
  });
});
