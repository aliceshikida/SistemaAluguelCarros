package com.example.aluguel.service;

import com.example.aluguel.dto.AutomovelRequest;
import com.example.aluguel.dto.AutomovelResponse;
import com.example.aluguel.model.Automovel;
import com.example.aluguel.model.Banco;
import com.example.aluguel.model.Cliente;
import com.example.aluguel.model.Empresa;
import com.example.aluguel.model.TipoProprietario;
import com.example.aluguel.repository.AutomovelRepository;
import com.example.aluguel.repository.BancoRepository;
import com.example.aluguel.repository.ClienteRepository;
import com.example.aluguel.repository.EmpresaRepository;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;

    public AutomovelService(
        AutomovelRepository automovelRepository,
        ClienteRepository clienteRepository,
        EmpresaRepository empresaRepository,
        BancoRepository bancoRepository
    ) {
        this.automovelRepository = automovelRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AutomovelResponse> listar() {
        return automovelRepository.findAll().stream().map(this::paraResponse).collect(Collectors.toList());
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public AutomovelResponse buscar(Long id) {
        Automovel a = automovelRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Automóvel não encontrado"));
        return paraResponse(a);
    }

    @Transactional
    public AutomovelResponse criar(AutomovelRequest request) {
        String placa = normalizarPlaca(request.getPlaca());
        if (automovelRepository.existsByPlacaIgnoreCase(placa)) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "Placa já cadastrada");
        }
        Automovel a = new Automovel();
        aplicar(a, request, placa);
        Automovel salvo = automovelRepository.save(a);
        return paraResponse(salvo);
    }

    @Transactional
    public AutomovelResponse atualizar(Long id, AutomovelRequest request) {
        Automovel a = automovelRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Automóvel não encontrado"));
        String placa = normalizarPlaca(request.getPlaca());
        automovelRepository.findByPlacaIgnoreCase(placa)
            .filter(other -> !other.getId().equals(id))
            .ifPresent(x -> {
                throw new HttpStatusException(HttpStatus.CONFLICT, "Placa já cadastrada");
            });
        aplicar(a, request, placa);
        Automovel salvo = automovelRepository.save(a);
        return paraResponse(salvo);
    }

    @Transactional
    public void remover(Long id) {
        if (!automovelRepository.existsById(id)) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND, "Automóvel não encontrado");
        }
        automovelRepository.deleteById(id);
    }

    private void aplicar(Automovel a, AutomovelRequest request, String placaNormalizada) {
        a.setMatricula(request.getMatricula().trim());
        a.setAno(request.getAno());
        a.setMarca(request.getMarca().trim());
        a.setModelo(request.getModelo().trim());
        a.setPlaca(placaNormalizada);
        a.setTipoProprietario(request.getTipoProprietario());
        a.setProprietarioCliente(null);
        a.setProprietarioEmpresa(null);
        a.setProprietarioBanco(null);
        switch (request.getTipoProprietario()) {
            case CLIENTE -> {
                Long pid = request.getProprietarioClienteId();
                if (pid == null) {
                    throw new HttpStatusException(HttpStatus.BAD_REQUEST, "proprietarioClienteId é obrigatório para tipo CLIENTE");
                }
                Cliente c = clienteRepository.findById(pid)
                    .orElseThrow(() -> new HttpStatusException(HttpStatus.BAD_REQUEST, "Cliente proprietário não encontrado"));
                a.setProprietarioCliente(c);
            }
            case EMPRESA -> {
                Long pid = request.getProprietarioEmpresaId();
                if (pid == null) {
                    throw new HttpStatusException(HttpStatus.BAD_REQUEST, "proprietarioEmpresaId é obrigatório para tipo EMPRESA");
                }
                Empresa e = empresaRepository.findById(pid)
                    .orElseThrow(() -> new HttpStatusException(HttpStatus.BAD_REQUEST, "Empresa proprietária não encontrada"));
                a.setProprietarioEmpresa(e);
            }
            case BANCO -> {
                Long pid = request.getProprietarioBancoId();
                if (pid == null) {
                    throw new HttpStatusException(HttpStatus.BAD_REQUEST, "proprietarioBancoId é obrigatório para tipo BANCO");
                }
                Banco b = bancoRepository.findById(pid)
                    .orElseThrow(() -> new HttpStatusException(HttpStatus.BAD_REQUEST, "Banco proprietário não encontrado"));
                a.setProprietarioBanco(b);
            }
            default -> throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Tipo de proprietário inválido");
        }
    }

    private AutomovelResponse paraResponse(Automovel a) {
        AutomovelResponse r = new AutomovelResponse();
        r.setId(a.getId());
        r.setMatricula(a.getMatricula());
        r.setAno(a.getAno());
        r.setMarca(a.getMarca());
        r.setModelo(a.getModelo());
        r.setPlaca(a.getPlaca());
        r.setTipoProprietario(a.getTipoProprietario());
        if (a.getProprietarioCliente() != null) {
            r.setProprietarioClienteId(a.getProprietarioCliente().getId());
        }
        if (a.getProprietarioEmpresa() != null) {
            r.setProprietarioEmpresaId(a.getProprietarioEmpresa().getId());
        }
        if (a.getProprietarioBanco() != null) {
            r.setProprietarioBancoId(a.getProprietarioBanco().getId());
        }
        return r;
    }

    private static String normalizarPlaca(String placa) {
        return placa == null ? "" : placa.replaceAll("\\s+", "").toUpperCase();
    }
}
