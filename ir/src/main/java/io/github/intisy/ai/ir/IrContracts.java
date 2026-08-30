package io.github.intisy.ai.ir;

import io.github.intisy.ai.tsemit.TsConstant;

/**
 * The typed key this package mints.
 *
 * @implNote A translator is a plugin category like a provider is, so it needs an id a host can
 * resolve it by. It had none, which is what stopped a host from treating every plugin kind the same
 * way and left it dispatching on category instead.
 *
 * <p>The annotated field is {@code Object} valued {@code null} because the typed key exists for the
 * emitted TypeScript and the Java side never reads it. The {@code String} beside it is what a JVM
 * host keys on, so a host takes the id from the package that minted it rather than writing the
 * literal out again.
 */
public final class IrContracts {

    /** The capability a plugin provides to translate between one vendor's wire format and the IR. */
    @TsConstant(type = "CapabilityType<VendorTranslator>", id = "translator")
    public static final Object TRANSLATOR = null;

    /** The id {@link #TRANSLATOR} names, for a host that resolves capabilities on the JVM. */
    public static final String TRANSLATOR_ID = "translator";

    private IrContracts() {
    }
}
