import middy from "@middy/core";
import {
  clear as logClear,
  debug as logDebug,
  error as logError,
  tag,
  untag,
} from "lesslog";
import log from "./index";

jest.mock("lesslog");

describe("log", () => {
  describe("after", () => {
    afterEach(() => {
      (logClear as jest.Mock).mockClear();
      (logDebug as jest.Mock).mockClear();
      (tag as jest.Mock).mockClear();
      (untag as jest.Mock).mockClear();
    });

    it("logs event", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");
      const response = Symbol("response");

      expect(
        log().after({ context, event, response } as any as middy.Request),
      ).toBeUndefined();

      expect(logDebug).toHaveBeenCalledTimes(1);
      expect(logDebug).toHaveBeenCalledWith("Response", { response });

      expect(logClear).toHaveBeenCalledTimes(1);
      expect(logClear).toHaveBeenCalledWith();

      expect(untag).toHaveBeenCalledTimes(1);
      expect(untag).toHaveBeenCalledWith();
    });
  });

  describe("before", () => {
    afterEach(() => {
      (logDebug as jest.Mock).mockClear();
    });

    it("logs event", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");

      expect(
        log().before({ context, event } as any as middy.Request),
      ).toBeUndefined();

      expect(logDebug).toHaveBeenCalledTimes(1);
      expect(logDebug).toHaveBeenCalledWith("Request", { context, event });

      expect(tag).toHaveBeenCalledTimes(1);
      expect(tag).toHaveBeenCalledWith(context.awsRequestId);
    });
  });

  describe("onError", () => {
    afterEach(() => {
      (logError as jest.Mock).mockClear();
    });

    it("logs error", () => {
      const context = { awsRequestId: Symbol("awsRequestId") };
      const event = Symbol("event");
      const details = Symbol("details");

      const error = Object.assign(new Error("‾\\_(ツ)_/‾"), { details });

      expect(
        log().onError({ context, error, event } as any as middy.Request),
      ).toBeUndefined();

      expect(logError).toHaveBeenCalledTimes(1);
      expect(logError).toHaveBeenCalledWith(error.message, {
        error: { details, message: error.message, stack: error.stack },
      });

      expect(untag).toHaveBeenCalledTimes(1);
      expect(untag).toHaveBeenCalledWith();
    });

    it("does nothing if no error", () => {
      const context = Symbol("context");
      const event = Symbol("event");

      expect(
        log().onError({ context, event } as any as middy.Request),
      ).toBeUndefined();

      expect(logError).not.toHaveBeenCalled();
    });
  });
});
